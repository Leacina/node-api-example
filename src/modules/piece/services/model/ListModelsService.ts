import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IModelsRepository from '../../repositories/IModelsRepository';

@injectable()
export default class ListModelService {
  constructor(
    @inject('ModelsRepository') private modelsRepository: IModelsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    user_id: number,
    filter?: IFilterRequestList,
  ): Promise<IResponseList> {
    const { id_conta } = await this.usersRepository.findById(user_id);

    const models = await this.modelsRepository.find(
      {
        id_conta,
      },
      filter,
    );

    return new ListResponse(models, filter.page, filter.pageSize);
  }
}
