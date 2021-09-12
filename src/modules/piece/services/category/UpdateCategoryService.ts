import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import Category from '@modules/piece/infra/typeorm/entities/Category';
import ICategoriesRepository from '../../repositories/ICategoriesRepository';

interface IRequest {
  category: string;
  category_id: number;
  user_id: number;
}

@injectable()
export default class ListBrandService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    category_id,
    user_id,
    category,
  }: IRequest): Promise<Category> {
    const user = await this.usersRepository.findById(user_id);
    const categoryModel = await this.categoriesRepository.findByID(
      category_id,
      user.id_conta,
    );

    if (category) {
      categoryModel.categoria = category;
      await this.categoriesRepository.save(categoryModel);
    }

    return categoryModel;
  }
}
