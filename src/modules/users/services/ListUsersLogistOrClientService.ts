import { inject, injectable } from 'tsyringe';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IUsersRepository from '../repositories/IUserRepository';

@injectable()
export default class ListUsersLogistByIDService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    logist: boolean,
    filter?: IFilterRequestList,
  ): Promise<IResponseList | undefined> {
    const user = await this.usersRepository.find(logist, filter);

    return new ListResponse(user, filter.page, filter.pageSize);
  }
}
