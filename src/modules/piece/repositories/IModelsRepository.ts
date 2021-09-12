import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import Model from '../infra/typeorm/entities/Model';
import ICreateModelDTO from '../dtos/ICreateModelDTO';
import IListDTO from '../dtos/IListDTO';

export default interface IModelRepository {
  create(data: ICreateModelDTO): Promise<Model>;
  find(data: IListDTO, filter: IFilterRequestList): Promise<Model[]>;
  findByBrand(id_marca: number): Promise<Model[]>;
  findByID(id: number, id_conta: number): Promise<Model | undefined>;
  delete(id: number): Promise<void>;
  save(data: Model): Promise<Model>;
}
