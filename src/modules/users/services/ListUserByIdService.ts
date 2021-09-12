import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';

@injectable()
export default class ListAccountByIDService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findById(id);

    if (user) {
      delete user.ds_senha;
    }

    return user;
  }
}
