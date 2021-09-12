import { inject, injectable } from 'tsyringe';
import IResponseList from '@shared/utils/dtos/IResponseList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import INotificationsRepository from '../../repositories/INotificationsRepository';

@injectable()
export default class ListNotificationService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    filter?: IFilterRequestList,
    user_id?: number,
  ): Promise<IResponseList | undefined> {
    const user = await this.usersRepository.findById(user_id);

    const notifications = await this.notificationsRepository.find(filter, {
      user_id,
      shop_id: user.id_loja,
      establishment_id: user.id_estabelecimento,
    });
    return new ListResponse(notifications, filter.page, filter.pageSize);
  }
}
