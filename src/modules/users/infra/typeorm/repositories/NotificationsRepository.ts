import { getRepository, Repository } from 'typeorm';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import IListtFilterNotificationDTO from '@modules/users/dtos/IListFilterNotificationDTO';
import ICreateNotificationDTO from '../../../dtos/ICreateNotificationDTO';
import INotificationsRepository from '../../../repositories/INotificationsRepository';

import Notification from '../entities/Notification';

class NotificationRepository implements INotificationsRepository {
  private ormRepository: Repository<Notification>;

  constructor() {
    this.ormRepository = getRepository(Notification);
  }

  public async create({
    id_cotacao,
    id_orcamento,
    id_usuario,
    mensagem,
    id_loja,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      id_cotacao,
      id_loja,
      id_orcamento,
      id_usuario,
      mensagem,
    });

    await this.ormRepository.save(notification);

    return notification;
  }

  public async findById(id: number): Promise<Notification | undefined> {
    const notification = await this.ormRepository.findOne({
      where: {
        id,
      },
    });

    return notification;
  }

  public async save(
    notification: Notification,
  ): Promise<Notification | undefined> {
    const notificationSave = await this.ormRepository.save(notification);
    return notificationSave;
  }

  public async saveAll(
    notification: Notification[],
  ): Promise<Notification[] | undefined> {
    const notificationSave = await this.ormRepository.save(notification);
    return notificationSave;
  }

  public async findByIdUser(id_user: number): Promise<Notification[]> {
    const notifications = this.ormRepository.find({
      where: {
        id_usuario: id_user,
      },
    });

    return notifications;
  }

  public async find(
    { search, page, pageSize }: IFilterRequestList,
    filterList?: IListtFilterNotificationDTO,
  ): Promise<Notification[]> {
    let where = '';

    if (filterList.shop_id > 0) {
      where = `notification.id_loja = ${filterList.shop_id}`;
    } else {
      where = `notification.id_usuario = ${filterList.user_id}`;
    }

    const notifications = await this.ormRepository.find({
      join: {
        alias: 'notification',
      },
      where: qb => {
        qb.where(where);
      },
      skip: page,
      take: pageSize,
      order: {
        id: 'DESC',
      },
      relations: ['cotacao', 'orcamento'],
    });
    return notifications;
  }

  async deleteByBudget(id_budget: number): Promise<void> {
    await this.ormRepository.delete({ id_orcamento: id_budget });
  }

  async deleteByQuotation(id_quotation: number): Promise<void> {
    await this.ormRepository.delete({ id_cotacao: id_quotation });
  }
}

export default NotificationRepository;
