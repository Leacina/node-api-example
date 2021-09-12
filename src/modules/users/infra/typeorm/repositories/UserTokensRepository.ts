import { getRepository, Repository } from 'typeorm';
import IUsersTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

class UserTokenRepository implements IUsersTokensRepository {
  private ormRepository: Repository<UserToken>;

  private searchSplit;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: {
        token,
      },
    });

    return userToken;
  }

  public async deleteById(user_id: number): Promise<void> {
    await this.ormRepository.delete({ user_id });
  }

  public async generate(user_id: number): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
      dh_inc: new Date(),
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }
}

export default UserTokenRepository;
