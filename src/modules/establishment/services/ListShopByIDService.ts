// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Shop from '../infra/typeorm/entities/Shop';
import IShopsRepository from '../repositories/IShopsRepository';

@injectable()
class ListShopByIDService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param shopsRepository
   */
  constructor(
    @inject('ShopsRepository')
    private shopsRepository: IShopsRepository,
  ) {}

  public async execute(id: number): Promise<Shop | undefined> {
    const shop = await this.shopsRepository.findById(id);

    return shop;
  }
}

export default ListShopByIDService;
