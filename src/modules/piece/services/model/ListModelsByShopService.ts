import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IModelsRepository from '../../repositories/IModelsRepository';

interface IRequest {
  user_id: number;
  id_loja: number;
  filter?: IFilterRequestList;
}

@injectable()
export default class ListModelsByShopService {
  constructor(
    @inject('ModelsRepository') private modelsRepository: IModelsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    filter,
    id_loja,
  }: IRequest): Promise<IResponseList> {
    const { id_conta } = await this.usersRepository.findById(user_id);

    const models = await this.modelsRepository.find(
      {
        id_conta,
        id_loja,
      },
      filter,
    );

    return new ListResponse(models, filter.page, filter.pagesize);
  }
}
