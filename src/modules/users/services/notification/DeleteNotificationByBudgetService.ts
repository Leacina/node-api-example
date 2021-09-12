import { inject, injectable } from 'tsyringe';
import INotificationsRepository from '../../repositories/INotificationsRepository';

@injectable()
export default class DeleteNotificationByIDService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute(id: number): Promise<void> {
    this.notificationsRepository.deleteByQuotation(id);
  }
}
