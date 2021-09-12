import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import Brand from '@modules/piece/infra/typeorm/entities/Brand';
import IBrandsRepository from '../../repositories/IBrandsRepository';

interface IRequest {
  id_brand: number;
  user_id: number;
}

@injectable()
export default class ListBrandByIDService {
  constructor(
    @inject('BrandsRepository') private brandsRepository: IBrandsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id_brand, user_id }: IRequest): Promise<Brand> {
    const user = await this.usersRepository.findById(user_id);

    const brand = await this.brandsRepository.findByID(id_brand, user.id_conta);

    return brand;
  }
}
