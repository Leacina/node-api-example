import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import Establishment from '../infra/typeorm/entities/Establishment';
import ICreateEstablishment from '../dtos/ICreateEstablishmentDto';

export default interface IEstablishmentRepository {
  findById(id: number): Promise<Establishment | undefined>;
  findByAccountId(id: number): Promise<Establishment[] | undefined>;
  find(data?: IFilterRequestList): Promise<Establishment[] | undefined>;
  create(data: ICreateEstablishment): Promise<Establishment | undefined>;
  save(establishment: Establishment): Promise<Establishment>;
}
