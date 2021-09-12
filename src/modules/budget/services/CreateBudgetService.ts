import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import * as yup from 'yup';
import IPiecesRepository from '@modules/piece/repositories/IPiecesRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import path from 'path';
import IShopsRepository from '@modules/establishment/repositories/IShopsRepository';
import INotificationsRepository from '@modules/users/repositories/INotificationsRepository';
import ioClient from 'socket.io-client';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IBudgetsRepository from '../repositories/IBudgetsRepository';
import Budget from '../infra/typeorm/entities/Budget';
import IBudgetItemsRepository from '../repositories/IBudgetItemsRepository';
import BudgetItems from '../infra/typeorm/entities/BudgetItem';
import ICreateBudgetItemDTO from '../dtos/ICreateBudgetItemDTO';

const ioClientConnect = ioClient('https://bateuweb.com.br/', {
  transports: ['websocket'],
  upgrade: false,
});

interface IRequestItems {
  id_produto: number;
  quantidade_solicitada: number;
  valor_orcamento: number;
}

interface IRequestBudget {
  emitente: string;
  emitente_email: string;
  emitente_telefone: string;
}

interface IResponse {
  orcamento: Budget;
  itens: BudgetItems[];
}

@injectable()
export default class CreateBudgetService {
  constructor(
    @inject('BudgetsRepository')
    private budgetsRepository: IBudgetsRepository,

    @inject('BudgetItemsRepository')
    private budgetItemsRepository: IBudgetItemsRepository,

    @inject('PiecesRepository')
    private piecesRepository: IPiecesRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('ShopsRepository')
    private shopsRepository: IShopsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    user_id: number,
    { emitente, emitente_email, emitente_telefone }: IRequestBudget,
    items: IRequestItems[],
  ): Promise<IResponse | undefined> {
    // Validações necessárias para criar o usuário
    const schemaItems = yup.array().of(
      yup.object().shape({
        id_produto: yup.number().required('Existem produtos sem código'),
        quantidade_solicitada: yup
          .number()
          .required('Existem produtos sem quantidade'),
        valor_orcamento: yup
          .number()
          .required('Existe produto sem valor de orçamento'),
      }),
    );

    const schema = yup.object().shape({
      emitente: yup.string().nullable().required('Emitente não informado'),
    });

    // Caso houver algum erro retorna com status 422
    await schemaItems.validate(items).catch(err => {
      throw new AppError(err.message, 422);
    });

    await schema
      .validate({ emitente, emitente_email, emitente_telefone })
      .catch(err => {
        throw new AppError(err.message, 422);
      });

    const user = await this.usersRepository.findById(user_id);

    if (user) {
      if (user.ds_login === 'administrador@bateu.com.br') {
        throw new AppError('Realize o login para criar o orçamento!', 401);
      }
    }

    let pieceNotFound: number;

    items.map(async item => {
      const piece = await this.piecesRepository.findByID(
        Number(item.id_produto),
      );

      if (!piece) {
        pieceNotFound = item.id_produto;
      }
    });

    if (pieceNotFound) {
      throw new AppError(`Peça ${pieceNotFound} não encontrada`, 401);
    }

    const {
      id_estabelecimento,
      id_loja,
    } = await this.piecesRepository.findByID(Number(items[0].id_produto));

    const budget = await this.budgetsRepository.create({
      emitente,
      emitente_telefone,
      emitente_email,
      id_estabelecimento,
      id_loja,
      situacao: 'P',
    });

    const budgetItems: ICreateBudgetItemDTO[] = [];

    items.map(async item => {
      const { id_produto, quantidade_solicitada, valor_orcamento } = item;

      budgetItems.push({
        id_peca: id_produto,
        quantidade: quantidade_solicitada,
        valor: valor_orcamento,
        id_orcamento: budget.id,
        situacao: 'Pendente',
      });
    });

    const itemsResult = await this.budgetItemsRepository.create(budgetItems);

    const shop = await this.shopsRepository.findById(id_loja);

    const notification = await this.notificationsRepository.create({
      id_orcamento: budget.id,
      id_loja,
      mensagem: `Novo orçamento criado por ${emitente}`,
    });

    ioClientConnect.emit('send notify', {
      room: `id_loja${shop.id}`,
      data: notification,
    });

    const createBudgetTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'budget_create.hbs',
    );

    this.mailProvider
      .sendMail({
        to: {
          name: shop.nm_loja,
          email: shop.email,
        },
        subject: '[BATEU] Solicitação de orçamento',
        templateData: {
          file: createBudgetTemplate,
          variable: {
            title: 'Nova solicitação de orçamento',
            text_info: `Você tem uma novo orçamento disponível solicitado por ${emitente}. Para mais informação, acesse o portal com um usuário da loja.`,
          },
        },
      })
      .catch(error => {
        console.log(error);
      });

    return {
      orcamento: budget,
      itens: itemsResult,
    };
  }
}
