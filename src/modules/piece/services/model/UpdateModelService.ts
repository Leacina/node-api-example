import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import Model from '@modules/piece/infra/typeorm/entities/Model';
import IModelsRepository from '../../repositories/IModelsRepository';

interface IRequest {
  model_name: string;
  model_id: number;
  brand_id: number;
  user_id: number;
}

@injectable()
export default class ListModelService {
  constructor(
    @inject('ModelsRepository') private modelsRepository: IModelsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    model_name,
    brand_id,
    model_id,
    user_id,
  }: IRequest): Promise<Model> {
    const user = await this.usersRepository.findById(user_id);
    const model = await this.modelsRepository.findByID(model_id, user.id_conta);

    if (model) {
      model.modelo = model_name;
      model.id_marca = brand_id;
      await this.modelsRepository.save(model);
    }

    return model;
  }
}
