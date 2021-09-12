import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import path from 'path';
import IUsersRepository from '../repositories/IUserRepository';

import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param usersRepository
   */
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (!userExists) {
      throw new AppError('Usuário não encontrado');
    }

    const { token } = await this.userTokensRepository.generate(
      Number(userExists.id),
    );

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: userExists.nm_usuario,
        email: userExists.ds_login,
      },
      subject: '[BATEU] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variable: {
          name: userExists.nm_usuario,
          link: `http://bateuweb.com.br/auth/recovery?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
