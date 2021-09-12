import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import AppError from '@shared/errors/AppError';
import IShopsRepository from '@modules/establishment/repositories/IShopsRepository';
import IEstablishmentsRepository from '@modules/establishment/repositories/IEstablishmentsRepository';
import IBrandsRepository from '../../repositories/IBrandsRepository';
import IModelsRepository from '../../repositories/IModelsRepository';
import Model from '../../infra/typeorm/entities/Model';

interface IRequest {
  id_marca: number;
  id_estabelecimento: number;
  id_loja: number;
  modelo: string;
  user_id: number;
}

@injectable()
export default class CreateModelService {
  constructor(
    @inject('ModelsRepository') private modelsRepository: IModelsRepository,

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
    id_marca,
    modelo,
    user_id,
  }: IRequest): Promise<Model | undefined> {
    if (!modelo) {
      throw new AppError('Modelo não informado');
    }

    const user = await this.usersRepository.findById(user_id);

    const brand = await this.brandsRepository.findByID(id_marca, user.id_conta);
    if (!brand) {
      throw new AppError('Marca não encontrada');
    }

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

    const model = await this.modelsRepository.create({
      id_conta: user.id_conta,
      id_estabelecimento,
      modelo,
      id_marca,
      id_loja,
    });

    return model;
  }
}
