import { inject, injectable } from 'tsyringe';
import Notification from '../../infra/typeorm/entities/Notification';
import INotificationsRepository from '../../repositories/INotificationsRepository';

@injectable()
export default class ListNotificationByIDService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute(id: number): Promise<Notification | undefined> {
    const notification = await this.notificationsRepository.findById(id);
    return notification;
  }
}
