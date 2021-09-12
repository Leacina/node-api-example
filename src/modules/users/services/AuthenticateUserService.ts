import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IShopsRepository from '@modules/establishment/repositories/IShopsRepository';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  senha: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ShopsRepository')
    private shopsRepository: IShopsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, senha }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Usuário ou senha inválido.', 401);
    }

    // const isPasswordMatch = await this.hashProvider.compareHash(
    //  senha,
    //  user.ds_senha,
    // );
    // if (
    //  Number(user.id_estabelecimento) === 0 &&
    //  Number(user.id_loja) === 0 &&
    //  user.ds_login !== 'administrador@bateu.com.br' &&
    //  user.tp_usuario === ''
    // ) {
    // throw new AppError('Usuário ou senha inválido.', 401);
    // }

    if (senha !== user.ds_senha) {
      throw new AppError('Usuário ou senha inválido.', 401);
    }

    const { expiresIn, secret } = authConfig.jwt;

    const shop = await this.shopsRepository.findById(user.id_loja);

    const token = sign(
      {
        id: user.id,
        name: user.nm_usuario,
        email: user.ds_login,
        is_bateu: user.ds_login === 'administrador@bateu.com.br',
        account_id: user.id_conta || '0',
        cellphone: user.telefone,
        establishment_id: user.id_estabelecimento || '0',
        shop_id: user.id_loja || '0',
        shop_name: shop ? shop.nm_loja : '',
      },
      secret,
      {
        expiresIn,
        subject: user.id,
      },
    );

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
