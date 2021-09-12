import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IBrandsRepository from '../../repositories/IBrandsRepository';

interface IRequest {
  id: number;
  user_id: number;
}

@injectable()
export default class DeleteBrandService {
  constructor(
    @inject('BrandsRepository') private brandsRepository: IBrandsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, id }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    const brand = await this.brandsRepository.findByID(id, user.id_conta);

    if (brand) {
      await this.brandsRepository.delete(id);
    }
  }
}
