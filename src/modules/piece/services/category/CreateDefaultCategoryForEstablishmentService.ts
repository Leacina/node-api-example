import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import ICategoriesRepository from '../../repositories/ICategoriesRepository';

@injectable()
export default class CreateDefaultCategoryForEstablishmentService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public execute(id_account: number): void {
    // Cria todas as categorias padrões do sistema...
    this.categoriesRepository.create({
      categoria: 'Sucata',
      id_conta: id_account,
    });

    this.categoriesRepository.create({
      categoria: 'Mecânica',
      id_conta: id_account,
    });

    this.categoriesRepository.create({
      categoria: 'Interior',
      id_conta: id_account,
    });

    this.categoriesRepository.create({
      categoria: 'Laterais',
      id_conta: id_account,
    });

    this.categoriesRepository.create({
      categoria: 'Traseira',
      id_conta: id_account,
    });

    this.categoriesRepository.create({
      categoria: 'Dianteira',
      id_conta: id_account,
    });
  }
}
