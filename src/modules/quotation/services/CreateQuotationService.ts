import { inject, injectable } from 'tsyringe';
import IEstablishmentsRepository from '@modules/establishment/repositories/IEstablishmentsRepository';
import IShopsRepository from '@modules/establishment/repositories/IShopsRepository';
import AppError from '@shared/errors/AppError';
import * as yup from 'yup';
import IPiecesRepository from '@modules/piece/repositories/IPiecesRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import path from 'path';
import INotificationsRepository from '@modules/users/repositories/INotificationsRepository';
import ioClient from 'socket.io-client';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IQuotationsRepository from '../repositories/IQuotationsRepository';
import IQuotationItemsRepository from '../repositories/IQuotationItemsRepository';
import ICreateQuotationItemDTO from '../dtos/ICreateQuotationItemDTO';

const ioClientConnect = ioClient('https://bateuweb.com.br/', {
  transports: ['websocket'],
  upgrade: false,
});

interface IRequestItems {
  descricao_peca: string;
  quantidade_solicitada: number;
}

interface IRequestBudget {
  emitente: string;
  emitente_email: string;
  emitente_telefone: string;
  identificador_cotacao: string;
  cidades?: string;
  lojas?: string;
}

// interface IResponse {
//  cotacao: Quotation;
//  itens: QuotationItem[];
// }

@injectable()
export default class CreateQuotationService {
  constructor(
    @inject('QuotationsRepository')
    private quotationsRepository: IQuotationsRepository,

    @inject('QuotationItemsRepository')
    private quotationItemsRepository: IQuotationItemsRepository,

    @inject('PiecesRepository')
    private piecesRepository: IPiecesRepository,

    @inject('EstablishmentsRepository')
    private establishmentsRepository: IEstablishmentsRepository,

    @inject('ShopsRepository')
    private shopsRepository: IShopsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    user_id: number,
    {
      emitente,
      emitente_email,
      emitente_telefone,
      identificador_cotacao,
      cidades,
      lojas,
    }: IRequestBudget,
    items: IRequestItems[],
  ): Promise<string | undefined> {
    // Validações necessárias para criar o usuário
    const schemaItems = yup.array().of(
      yup.object().shape({
        descricao_peca: yup
          .string()
          .nullable()
          .required('Existem produtos sem descrição'),
        quantidade_solicitada: yup
          .number()
          .required('Existem produtos sem quantidade'),
      }),
    );

    const schema = yup.object().shape({
      emitente: yup.string().nullable().required('Emitente não informado'),
      identificador_cotacao: yup
        .string()
        .nullable()
        .required('Identificador da cotação não informado'),
    });

    // Caso houver algum erro retorna com status 422
    await schemaItems.validate(items).catch(err => {
      throw new AppError(err.message, 422);
    });

    await schema
      .validate({
        emitente,
        emitente_email,
        emitente_telefone,
        identificador_cotacao,
      })
      .catch(err => {
        throw new AppError(err.message, 422);
      });

    if (!cidades) {
      throw new AppError(
        'Nenhuma cidade selecionada para realizar a cotação',
        422,
      );
    }

    const user = await this.usersRepository.findById(user_id);

    if (user) {
      if (user.ds_login === 'administrador@bateu.com.br') {
        throw new AppError('Realize o login para criar a cotação!', 401);
      }
    }

    const lojasSplit = lojas.split(';');

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < lojasSplit.length; i++) {
      const search = `nm_loja:${lojasSplit[i]};`;

      // eslint-disable-next-line no-await-in-loop
      const shops = await this.shopsRepository.find({ search });

      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < shops.length; x++) {
        // eslint-disable-next-line no-await-in-loop
        const quotation = await this.quotationsRepository.create({
          emitente,
          emitente_telefone,
          emitente_email,
          id_estabelecimento: Number(shops[x].id_estabelecimento),
          id_loja: Number(shops[x].id),
          situacao: 'P',
          identificador_cotacao,
        });

        const quotationItems: ICreateQuotationItemDTO[] = [];

        items.map(async item => {
          const { descricao_peca, quantidade_solicitada } = item;

          quotationItems.push({
            descricao_peca,
            quantidade_peca: Number(quantidade_solicitada),
            identificador_cotacao,
            id_cotacao: Number(quotation.id),
            situacao: 'Pendente',
            dh_inc: new Date(),
          });
        });
        // eslint-disable-next-line no-await-in-loop
        await this.quotationItemsRepository.create(quotationItems);

        const createQuotationTemplate = path.resolve(
          __dirname,
          '..',
          'views',
          'quotation_create.hbs',
        );

        // eslint-disable-next-line no-await-in-loop
        const notification = await this.notificationsRepository.create({
          id_cotacao: Number(quotation.id),
          id_loja: Number(shops[x].id),
          id_usuario: 0,
          mensagem: `Nova cotação criada por ${emitente}`,
        });

        ioClientConnect.emit('send notify', {
          room: `id_loja${shops[x].id}`,
          data: notification,
        });

        // eslint-disable-next-line no-await-in-loop
        this.mailProvider
          .sendMail({
            to: {
              name: shops[x].nm_loja,
              email: shops[x].email,
            },
            subject: '[BATEU] Solicitação de cotação',
            templateData: {
              file: createQuotationTemplate,
              variable: {
                title: 'Nova solicitação de cotação',
                text_info: `Você tem uma nova cotação disponível solicitada por ${emitente}. Para mais informação, acesse o portal com um usuário da loja.`,
              },
            },
          })
          .catch(error => {
            console.log(error);
          });
      }
    }

    return 'Cotação criada com sucesso';
  }
}
