import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import Brand from '@modules/piece/infra/typeorm/entities/Brand';
import IBrandsRepository from '../../repositories/IBrandsRepository';

interface IRequest {
  marca: string;
  brand_id: number;
  user_id: number;
  pais: string;
}

@injectable()
export default class ListBrandService {
  constructor(
    @inject('BrandsRepository') private brandsRepository: IBrandsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    brand_id,
    user_id,
    marca,
    pais,
  }: IRequest): Promise<Brand> {
    const user = await this.usersRepository.findById(user_id);
    const brand = await this.brandsRepository.findByID(brand_id, user.id_conta);

    if (brand) {
      brand.marca = marca;
      brand.pais = pais;
      await this.brandsRepository.save(brand);
    }

    return brand;
  }
}
