import IListBrandDTO from '@modules/piece/dtos/IListDTO';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import BudgetItem from '../infra/typeorm/entities/BudgetItem';
import ICreateBudgetItemDTO from '../dtos/ICreateBudgetItemDTO';
import IProcessBudgetItemsDTO from '../dtos/IProcessBudgetItemsDTO';

export default interface IBudgetItemsRepository {
  create(data: ICreateBudgetItemDTO[]): Promise<BudgetItem[]>;
  find(
    budget_id: number,
    data: IListBrandDTO,
    filter: IFilterRequestList,
  ): Promise<BudgetItem[]>;
  process(dataProcess: IProcessBudgetItemsDTO): Promise<BudgetItem>;
  sum(budget_id: number): Promise<number>;
}
