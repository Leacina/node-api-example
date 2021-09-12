// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import * as yup from 'yup';
import AppError from '@shared/errors/AppError';

import IEstablishmentRepository from '@modules/establishment/repositories/IEstablishmentsRepository';
import IShopRepository from '@modules/establishment/repositories/IShopsRepository';
import IUsersRepository from '../repositories/IUserRepository';
import IAccountsRepository from '../repositories/IAccountsRepository';

import User from '../infra/typeorm/entities/User';
import ICreateUserDto from '../dtos/ICreateUserDTO';

@injectable()
class UpdateUserService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param usersRepository
   */
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ShopsRepository')
    private shopsRepository: IShopRepository,

    @inject('EstablishmentsRepository')
    private establishmentsRepository: IEstablishmentRepository,

    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
  ) {}

  public async execute(
    id_user: number,
    {
      ds_login,
      ds_senha,
      id_conta,
      id_estabelecimento,
      id_loja,
      id_perfil,
      is_ativo,
      nm_usuario,
      telefone,
      tp_usuario,
    }: ICreateUserDto,
  ): Promise<User> {
    const data = {
      ds_login,
      ds_senha,
      id_conta,
      id_estabelecimento,
      id_loja,
      id_perfil,
      is_ativo,
      nm_usuario,
      telefone,
      tp_usuario,
    };

    // Validações necessárias para criar o usuário
    const schema = yup.object().shape({
      ds_login: yup
        .string()
        .email('E-mail informado inválido')
        .required('O campo e-mail é obrigatório'),
      nm_usuario: yup.string().required('O campo nome não foi informado'),
      ds_senha: yup.string().required('O campo senha não foi informado'),
      // id_conta: yup.number().required('O campo conta não foi informado'),
      id_perfil: yup.number().required('O campo perfil não foi informado'),
      is_ativo: yup.string().default(() => {
        return 'Sim';
      }),
    });

    // Caso houver algum erro retorna com status 422
    await schema.validate(data).catch(err => {
      throw new AppError(err.message, 422);
    });

    // Se não existir estabelecimento
    const establishment = await this.establishmentsRepository.findById(
      id_estabelecimento || 0,
    );
    if (!establishment) {
      throw new AppError('Estabelecimento informado inválido');
    }

    // Se não existe loja
    const shop = await this.shopsRepository.findById(id_loja || 0);
    if (!shop) {
      throw new AppError('Loja informada inválida');
    }

    // Cria o usuario
    const user = await this.usersRepository.findById(id_user);

    // Seta os novos valores
    user.ds_login = data.ds_login;
    user.id_perfil = data.id_perfil;
    user.nm_usuario = data.nm_usuario;
    user.id_estabelecimento = id_estabelecimento;
    user.id_loja = id_loja;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
