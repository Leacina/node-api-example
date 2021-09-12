import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import AppError from '@shared/errors/AppError';
import ICategoriesRepository from '../../repositories/ICategoriesRepository';
import Category from '../../infra/typeorm/entities/Category';

interface IRequest {
  category: string;
  user_id: number;
}

@injectable()
export default class CreateCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    category,
    user_id,
  }: IRequest): Promise<Category | undefined> {
    if (!category) {
      throw new AppError('Nome da categoria não informada');
    }

    const user = await this.usersRepository.findById(user_id);

    const categoryModel = await this.categoriesRepository.create({
      categoria: category,
      id_conta: user.id_conta,
    });
    return categoryModel;
  }
}
