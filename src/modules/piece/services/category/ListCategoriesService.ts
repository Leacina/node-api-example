import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import ICategoriesRepository from '../../repositories/ICategoriesRepository';

@injectable()
export default class ListCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    user_id: number,
    filter?: IFilterRequestList,
  ): Promise<IResponseList> {
    const { id_estabelecimento } = await this.usersRepository.findById(user_id);

    const brands = await this.categoriesRepository.find(
      id_estabelecimento,
      filter,
    );

    return new ListResponse(
      brands,
      filter.page,
      filter.pageSize,
      filter.ignorePage,
    );
  }
}
