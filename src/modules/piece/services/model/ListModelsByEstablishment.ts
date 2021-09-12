import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IModelsRepository from '../../repositories/IModelsRepository';

interface IRequest {
  user_id: number;
  id_estabelecimento: number;
  filter?: IFilterRequestList;
}

@injectable()
export default class ListModelByEstablishmentService {
  constructor(
    @inject('ModelsRepository') private modelsRepository: IModelsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    filter,
    id_estabelecimento,
    user_id,
  }: IRequest): Promise<IResponseList> {
    const { id_conta } = await this.usersRepository.findById(user_id);

    const models = await this.modelsRepository.find(
      {
        id_conta,
        id_estabelecimento,
      },
      filter,
    );

    return new ListResponse(models, filter.page, filter.pagesize);
  }
}
