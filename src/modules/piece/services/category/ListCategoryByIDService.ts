import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import Category from '@modules/piece/infra/typeorm/entities/Category';
import ICategoriesRepository from '../../repositories/ICategoriesRepository';

interface IRequest {
  id_category: number;
  user_id: number;
}

@injectable()
export default class ListCategoryByIDService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id_category, user_id }: IRequest): Promise<Category> {
    const user = await this.usersRepository.findById(user_id);

    const category = await this.categoriesRepository.findByID(
      id_category,
      user.id_conta,
    );

    return category;
  }
}
