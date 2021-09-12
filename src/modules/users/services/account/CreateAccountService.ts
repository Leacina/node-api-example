// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import * as yup from 'yup';
import AppError from '@shared/errors/AppError';

import Account from '../../infra/typeorm/entities/Account';
import IAccountsRepository from '../../repositories/IAccountsRepository';
import IUsersRepository from '../../repositories/IUserRepository';
import ICreateAccountDTO from '../../dtos/ICreateAccountDTO';
import User from '../../infra/typeorm/entities/User';

interface IRequest {
  conta: Account;
  usuario: User;
}

@injectable()
class CreateUserService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param accountsRepository
   */
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    is_anuncio,
    is_ativo,
    nm_conta,
  }: ICreateAccountDTO): Promise<IRequest> {
    // Validações necessárias para criar o usuário
    const schema = yup.object().shape({
      nm_conta: yup.string().required('Nome da conta não foi informado'),
      is_anuncio: yup.string().default(() => {
        return 'Sim';
      }),
      is_ativo: yup.string().default(() => {
        return 'Sim';
      }),
    });

    // Caso houver algum erro retorna com status 422
    await schema
      .validate({
        is_anuncio,
        is_ativo,
        nm_conta,
      })
      .catch(err => {
        throw new AppError(err.message, 422);
      });

    // Cria a conta
    const account = await this.accountsRepository.create({
      is_anuncio: is_anuncio || 'Sim',
      is_ativo: is_ativo || 'Sim',
      nm_conta,
    });

    // Cria o usario de acordo com a conta (Usuario administradosr)
    const user = await this.usersRepository.create({
      ds_login: `administrador@${nm_conta
        .replace(/\s/g, '')
        .toLowerCase()}.com.br`,
      ds_senha: '$administrador102030$',
      id_conta: account.id,
      id_estabelecimento: null,
      id_perfil: 999,
      nm_usuario: 'Administrador',
    });

    return { conta: account, usuario: user };
  }
}

export default CreateUserService;
