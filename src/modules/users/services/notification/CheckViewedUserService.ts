import { inject, injectable } from 'tsyringe';
import Notification from '../../infra/typeorm/entities/Notification';
import INotificationsRepository from '../../repositories/INotificationsRepository';

@injectable()
export default class ListNotificationByIDService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute(id_user: number): Promise<Notification | undefined> {
    const notification = await this.notificationsRepository.findById(id_user);

    // Percorre todos e seta como visualizado
    // eslint-disable-next-line no-plusplus
    // for (let i = 0; i < notification.length; i++) {
    //   notification[i].is_visualizado = 1;
    // }

    // this.notificationsRepository.saveAll(notification);
    notification.is_visualizado = 1;

    this.notificationsRepository.save(notification);

    return notification;
  }
}
