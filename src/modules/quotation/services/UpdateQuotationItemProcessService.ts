import { inject, injectable } from 'tsyringe';
import path from 'path';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import INotificationsRepository from '@modules/users/repositories/INotificationsRepository';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import ioClient from 'socket.io-client';
import IQuotationItemsRepository from '../repositories/IQuotationItemsRepository';
import QuotationItem from '../infra/typeorm/entities/QuotationItem';
import IQuotationsRepository from '../repositories/IQuotationsRepository';

const ioClientConnect = ioClient('https://bateuweb.com.br/', {
  transports: ['websocket'],
  upgrade: false,
});

interface IRequest {
  quotation_item_id: number;
  isConfirm: boolean;
}

@injectable()
export default class UpdateQuotationItemProcessService {
  constructor(
    @inject('QuotationItemsRepository')
    private quotationItemsRepository: IQuotationItemsRepository,

    @inject('QuotationsRepository')
    private quotationsRepository: IQuotationsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    quotation_item_id,
    isConfirm,
  }: IRequest): Promise<QuotationItem> {
    const budgetItem = await this.quotationItemsRepository.process({
      quotation_item_id,
      isConfirm,
    });

    // Verifica se a cotação foi finalizada
    const quotation = await this.quotationsRepository.findById(
      Number(budgetItem.id_cotacao),
    );

    const usuario = await this.usersRepository.findByEmail(
      quotation.emitente_email,
    );

    // Se já foi confirmado envia o email
    if (quotation.situacao === 'VI' || quotation.situacao === 'VP') {
      await this.notificationsRepository.deleteByQuotation(
        Number(quotation.id),
      );

      const notification = await this.notificationsRepository.create({
        id_cotacao: Number(quotation.id),
        id_usuario: Number(usuario.id),
        mensagem: `A sua cotação ${quotation.identificador_cotacao} foi finalizada pela loja ${quotation.loja.nm_loja}`,
      });

      ioClientConnect.emit('send notify', {
        room: `id_usuario${usuario.id}`,
        data: notification,
      });

      const createQuotationTemplate = path.resolve(
        __dirname,
        '..',
        'views',
        'quotation_create.hbs',
      );

      // eslint-disable-next-line no-await-in-loop
      this.mailProvider
        .sendMail({
          to: {
            name: quotation.emitente,
            email: quotation.emitente_email,
          },
          subject: '[BATEU] Cotação finalizada',
          templateData: {
            file: createQuotationTemplate,
            variable: {
              title: 'Cotação finalizada!',
              text_info: `Você tem uma cotação finalizada pela loja ${quotation.loja.nm_loja}. Para mais detalhes, acesse o Bateu.`,
            },
          },
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      const notification = await this.notificationsRepository.create({
        id_cotacao: Number(quotation.id),
        id_usuario: Number(usuario.id),
        id_loja: 0,
        mensagem: `O item ${budgetItem.descricao_peca} da sua cotação ${quotation.identificador_cotacao} foi alterado.`,
      });

      ioClientConnect.emit('send notify', {
        room: `id_usuario${usuario.id}`,
        data: notification,
      });
    }

    return budgetItem;
  }
}
