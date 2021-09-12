import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import IListDTO from '@modules/piece/dtos/IListDTO';
import Budget from '../infra/typeorm/entities/Budget';
import ICreateBudgetDTO from '../dtos/ICreateBudgetDTO';
import IProcessBudgetDTO from '../dtos/IProcessBudgetDTO';

export default interface IBudgetsRepository {
  create(data: ICreateBudgetDTO): Promise<Budget>;
  find(data: IListDTO, filter: IFilterRequestList): Promise<Budget[]>;
  findById(id: number, data: IListDTO): Promise<Budget>;
  findByEmail(
    budget_email: string,
    data: IListDTO,
    filter: IFilterRequestList,
  ): Promise<Budget[]>;
  process(dataProcess: IProcessBudgetDTO, data: IListDTO): Promise<Budget>;
}
