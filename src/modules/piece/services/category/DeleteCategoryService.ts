import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import ICategoriesRepository from '../../repositories/ICategoriesRepository';

interface IRequest {
  id: number;
  user_id: number;
}

@injectable()
export default class DeleteCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, user_id }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    const category = await this.categoriesRepository.findByID(
      id,
      user.id_conta,
    );

    if (category) {
      await this.categoriesRepository.delete(id);
    }
  }
}
