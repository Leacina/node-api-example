import { getRepository, Repository } from 'typeorm';
import ICategoriesRepository from '@modules/piece/repositories/ICategoriesRepository';
import ICreateCategoryDTO from '@modules/piece/dtos/ICreateCategoryDTO';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import Category from '../entities/Category';

class CategoriesRepository implements ICategoriesRepository {
  private ormRepository: Repository<Category>;

  constructor() {
    this.ormRepository = getRepository(Category);
  }

  async create({ categoria, id_conta }: ICreateCategoryDTO): Promise<Category> {
    const brand = this.ormRepository.create({
      categoria,
      id_conta,
      dh_inc: new Date(),
    });

    await this.ormRepository.save(brand);

    return brand;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  async save(data: Category): Promise<Category> {
    const category = await this.ormRepository.save(data);
    return category;
  }

  async findByID(id: number, id_conta: number): Promise<Category> {
    const category = await this.ormRepository.findOne({
      where: {
        id,
        id_conta,
      },
    });

    return category;
  }

  async find(
    id_conta: number,
    { page, pageSize, ignorePage }: IFilterRequestList,
  ): Promise<Category[]> {
    const categories = await this.ormRepository.find({
      where:
        !id_conta || Number(id_conta) === 0
          ? {}
          : {
              id_conta,
            },
      // eslint-disable-next-line no-nested-ternary
      skip: !ignorePage ? (page ? page - 1 : 0) : 0,
      take: !ignorePage ? pageSize + 1 || 11 : 0,
      relations: ['conta'],
      order: !ignorePage
        ? {
            id: 'DESC',
          }
        : {
            categoria: 'ASC',
          },
    });

    return categories;
  }
}

export default CategoriesRepository;
