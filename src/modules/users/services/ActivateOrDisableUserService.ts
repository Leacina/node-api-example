import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';

@injectable()
export default class ActivateOrDisableUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    id: number,
    activate: boolean,
  ): Promise<User | undefined> {
    const user = await this.usersRepository.findById(id);

    user.is_ativo = activate ? '1' : '0';

    const userSave = await this.usersRepository.save(user);

    return userSave;
  }
}
