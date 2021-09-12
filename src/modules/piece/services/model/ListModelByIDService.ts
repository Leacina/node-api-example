import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import Model from '@modules/piece/infra/typeorm/entities/Model';
import IModelsRepository from '../../repositories/IModelsRepository';

interface IRequest {
  id_model: number;
  user_id: number;
}

@injectable()
export default class ListModelByIDService {
  constructor(
    @inject('ModelsRepository') private modelsRepository: IModelsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id_model, user_id }: IRequest): Promise<Model> {
    const user = await this.usersRepository.findById(user_id);

    const model = await this.modelsRepository.findByID(id_model, user.id_conta);

    return model;
  }
}
