import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import Shop from '../infra/typeorm/entities/Shop';
import ICreateShop from '../dtos/ICreateShopDTO';

export default interface IShopRepository {
  findById(id: number): Promise<Shop | undefined>;
  findByAccountId(id: number): Promise<Shop[] | undefined>;
  findByEstablishmentId(id: number): Promise<Shop[] | undefined>;
  find(data?: IFilterRequestList): Promise<Shop[] | undefined>;
  create(data: ICreateShop): Promise<Shop | undefined>;
  save(shop: Shop): Promise<Shop>;
}
