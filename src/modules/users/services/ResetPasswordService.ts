import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';
import IUsersRepository from '../repositories/IUserRepository';
// import User from '../infra/typeorm/entities/User';

import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param usersRepository
   */
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Token do usuário não existe');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    const tokenCreateAt = userToken.dh_inc;
    const compareDate = addHours(tokenCreateAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Link para recuperação de senha expirado');
    }

    user.ds_senha = password;

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
