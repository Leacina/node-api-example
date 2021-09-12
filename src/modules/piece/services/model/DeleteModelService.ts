import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IModelsRepository from '../../repositories/IModelsRepository';

interface IRequest {
  id: number;
  user_id: number;
}

@injectable()
export default class DeleteModelService {
  constructor(
    @inject('ModelsRepository') private modelsRepository: IModelsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, user_id }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    const model = await this.modelsRepository.findByID(id, user.id_conta);

    if (model) {
      await this.modelsRepository.delete(id);
    }
  }
}
