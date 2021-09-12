import { inject, injectable } from 'tsyringe';
import ioClient from 'socket.io-client';
import INotificationsRepository from '@modules/users/repositories/INotificationsRepository';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IQuotationItemsRepository from '../repositories/IQuotationItemsRepository';
import QuotationItem from '../infra/typeorm/entities/QuotationItem';
import IQuotationsRepository from '../repositories/IQuotationsRepository';

const ioClientConnect = ioClient('https://bateuweb.com.br/', {
  transports: ['websocket'],
  upgrade: false,
});

interface IRequest {
  id: number;
  value: number;
}

@injectable()
export default class UpdateValueItemQuotationProcessService {
  constructor(
    @inject('QuotationItemsRepository')
    private quotationItemsRepository: IQuotationItemsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('QuotationsRepository')
    private quotationsRepository: IQuotationsRepository,
  ) {}

  public async execute({ id, value }: IRequest): Promise<QuotationItem> {
    const budgetItem = await this.quotationItemsRepository.updateValue({
      id,
      value,
    });

    // Verifica se a cotação foi finalizada
    const quotation = await this.quotationsRepository.findById(
      Number(budgetItem.id_cotacao),
    );

    // Busca o usuário para saber qual o id para notificar
    const usuario = await this.usersRepository.findByEmail(
      quotation.emitente_email,
    );

    const notification = await this.notificationsRepository.create({
      id_cotacao: Number(quotation.id),
      id_usuario: Number(usuario.id),
      id_loja: 0,
      mensagem: `O item ${budgetItem.descricao_peca} da sua cotação ${quotation.identificador_cotacao} teve o valor alterado pela loja ${quotation.loja.nm_loja}.`,
    });

    ioClientConnect.emit('send notify', {
      room: `id_usuario${usuario.id}`,
      data: notification,
    });

    return budgetItem;
  }
}
