import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import Brand from '../infra/typeorm/entities/Brand';
import ICreateBrandDTO from '../dtos/ICreateBrandDTO';
import IListBrandDTO from '../dtos/IListDTO';

export default interface IBrandRepository {
  create(data: ICreateBrandDTO): Promise<Brand>;
  find(data: IListBrandDTO, filter: IFilterRequestList): Promise<Brand[]>;
  findByID(id: number, id_conta: number): Promise<Brand | undefined>;
  delete(id: number): Promise<void>;
  save(data: Brand): Promise<Brand>;
}
