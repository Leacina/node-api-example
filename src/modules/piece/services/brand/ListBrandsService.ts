import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IBrandsRepository from '../../repositories/IBrandsRepository';

@injectable()
export default class ListBrandService {
  constructor(
    @inject('BrandsRepository') private brandsRepository: IBrandsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    user_id: number,
    filter?: IFilterRequestList,
  ): Promise<IResponseList> {
    const {
      id_conta,
      id_estabelecimento,
      id_loja,
    } = await this.usersRepository.findById(user_id);

    const brands = await this.brandsRepository.find(
      {
        id_conta,
        id_estabelecimento,
        id_loja,
      },
      filter,
    );

    return new ListResponse(brands, filter.page, filter.pageSize);
  }
}
