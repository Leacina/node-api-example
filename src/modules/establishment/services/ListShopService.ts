// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IShopsRepository from '../repositories/IShopsRepository';

@injectable()
class ListShopService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param shopsRepository
   */
  constructor(
    @inject('ShopsRepository')
    private shopsRepository: IShopsRepository,
  ) {}

  public async execute(
    filter?: IFilterRequestList,
  ): Promise<IResponseList | undefined> {
    const shop = await this.shopsRepository.find(filter);

    return new ListResponse(shop, filter.page, filter.pageSize);
  }
}

export default ListShopService;
