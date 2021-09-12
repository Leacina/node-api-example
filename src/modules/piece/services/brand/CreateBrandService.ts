import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import AppError from '@shared/errors/AppError';
import IShopsRepository from '@modules/establishment/repositories/IShopsRepository';
import IEstablishmentsRepository from '@modules/establishment/repositories/IEstablishmentsRepository';
import IBrandsRepository from '../../repositories/IBrandsRepository';
import Brand from '../../infra/typeorm/entities/Brand';

interface IRequest {
  marca: string;
  id_estabelecimento: number;
  pais: string;
  id_loja: number;
  user_id: number;
}

@injectable()
export default class CreateBrandService {
  constructor(
    @inject('BrandsRepository') private brandsRepository: IBrandsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ShopsRepository')
    private shopsRepository: IShopsRepository,

    @inject('EstablishmentsRepository')
    private establishmentsRepository: IEstablishmentsRepository,
  ) {}

  public async execute({
    id_estabelecimento,
    id_loja,
    marca,
    pais,
    user_id,
  }: IRequest): Promise<Brand | undefined> {
    if (!marca) {
      throw new AppError('Nome da marca não informada');
    }

    if (!pais) {
      throw new AppError('País da marca não informada');
    }

    const user = await this.usersRepository.findById(user_id);

    // Verifica se o estabelecimento esta correto
    if (id_estabelecimento) {
      const establishment = await this.establishmentsRepository.findById(
        id_estabelecimento,
      );
      // Verifica se o estabelecimento existe
      if (!establishment) {
        throw new AppError('Estabelecimento informado inválido');
      }
      // Verifica se tem permissão
      if (establishment.id_conta !== user.id_conta) {
        throw new AppError(
          'Você não tem permissão para criar com este estabelecimento',
          403,
        );
      }
    }

    // Verifica se a loja esta correto
    if (id_loja) {
      const shop = await this.shopsRepository.findById(id_loja);
      if (!shop) {
        throw new AppError('Loja informada inválida');
      }
      // Verifica se tem permissão
      if (shop.id_conta !== user.id_conta) {
        throw new AppError(
          'Você não tem permissão para criar com esta loja',
          403,
        );
      }
    }

    const brand = await this.brandsRepository.create({
      marca,
      id_conta: user.id_conta,
      id_loja,
      id_estabelecimento,
      pais,
    });
    return brand;
  }
}
