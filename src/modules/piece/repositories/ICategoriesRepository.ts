import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import Category from '../infra/typeorm/entities/Category';
import ICategoryBrandDTO from '../dtos/ICreateCategoryDTO';

export default interface ICategoriesRepository {
  create(data: ICategoryBrandDTO): Promise<Category>;
  find(id_conta: number, filter: IFilterRequestList): Promise<Category[]>;
  findByID(id: number, id_conta: number): Promise<Category | undefined>;
  delete(id: number): Promise<void>;
  save(data: Category): Promise<Category>;
}
