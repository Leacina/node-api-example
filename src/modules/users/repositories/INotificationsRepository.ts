import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import Notification from '../infra/typeorm/entities/Notification';
import IListtFilterNotificationDTO from '../dtos/IListFilterNotificationDTO';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
  findByIdUser(id_user: number): Promise<Notification[] | undefined>;
  findById(id: number): Promise<Notification | undefined>;
  find(
    filter?: IFilterRequestList,
    filterList?: IListtFilterNotificationDTO,
  ): Promise<Notification[] | undefined>;
  deleteByBudget(id_budget: number): Promise<void>;
  deleteByQuotation(id_quotation: number): Promise<void>;
  save(notification: Notification): Promise<Notification | undefined>;
  saveAll(notification: Notification[]): Promise<Notification[] | undefined>;
}
