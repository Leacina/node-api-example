// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IShopsRepository from '../repositories/IShopsRepository';

@injectable()
class ListShopByAccountIDService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param shopsRepository
   */
  constructor(
    @inject('ShopsRepository')
    private shopsRepository: IShopsRepository,
  ) {}

  public async execute(id: number): Promise<IResponseList | undefined> {
    const shop = await this.shopsRepository.findByAccountId(id);

    return { hasNext: true, items: shop };
  }
}

export default ListShopByAccountIDService;
