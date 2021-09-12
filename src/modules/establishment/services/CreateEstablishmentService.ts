import { injectable, inject, container } from 'tsyringe';
import * as yup from 'yup';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import IAccounntsRepository from '@modules/users/repositories/IAccountsRepository';
import Establishment from '../infra/typeorm/entities/Establishment';
import IEstablishmentsRepository from '../repositories/IEstablishmentsRepository';
import CreateDefaultCategoryForEstablishmentService from '../../piece/services/category/CreateDefaultCategoryForEstablishmentService';

export interface IRequest {
  nm_estabelecimento: string;
  razao_social: string;
  cnpj_cpf: string;
  responsavel: string;
  telefone_responsavel: string;
  cidade: string;
  estado: string;
  quantidade_lojas: number;
}

interface IResponse {
  estabelecimento: Establishment;
  usuario: User;
}

@injectable()
export default class CreateEstablishmentService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param establishmentsRepository
   */
  constructor(
    @inject('EstablishmentsRepository')
    private establishmentsRepository: IEstablishmentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AccountsRepository')
    private accountsRepository: IAccounntsRepository,
  ) {}

  public async execute(
    {
      cnpj_cpf,
      nm_estabelecimento,
      razao_social,
      responsavel,
      cidade,
      estado,
      quantidade_lojas,
      telefone_responsavel,
    }: IRequest,
    user_id: number,
  ): Promise<IResponse | undefined> {
    // Validações necessárias para criar o usuário
    const schema = yup.object().shape({
      // cnpj_cpf: yup.string().required('CPF/CNPJ não informado'),
      nm_estabelecimento: yup
        .string()
        .trim()
        .required('Nome da empresa não informado'),
      // razao_social: yup.string().required('Razão social não informada'),
      responsavel: yup.string().trim().required('Responsável não informado'),
      cidade: yup.string().trim().required('Cidade não informado'),
      estado: yup.string().nullable().required('Estado não informado'),
      quantidade_lojas: yup
        .number()
        .required('Quantidade de lojas não informado'),
      telefone_responsavel: yup
        .string()
        .required('Telefone do responsável não informado'),
    });

    // Caso houver algum erro retorna com status 422
    await schema
      .validate({
        // cnpj_cpf,
        nm_estabelecimento,
        // razao_social,
        responsavel,
        cidade,
        estado,
        quantidade_lojas,
        telefone_responsavel,
      })
      .catch(err => {
        throw new AppError(err.message, 422);
      });

    const user = await this.usersRepository.findById(user_id);

    const establishment = await this.establishmentsRepository.create({
      cnpj_cpf,
      id_conta: user.id_conta,
      nm_estabelecimento,
      razao_social: nm_estabelecimento,
      responsavel,
      cidade,
      estado,
      quantidade_lojas,
      telefone_responsavel,
    });

    const account = await this.accountsRepository.create({
      id: Number(establishment.id),
      is_anuncio: 'Sim',
      is_ativo: 'Sim',
      nm_conta: establishment.nm_estabelecimento,
    });

    const establishmentUpdate = await this.establishmentsRepository.findById(
      Number(establishment.id),
    );

    establishmentUpdate.id_conta = account.id;

    await this.establishmentsRepository.save(establishmentUpdate);

    // Cria todas as categorias defaultr
    const createDefaultCategory = container.resolve(
      CreateDefaultCategoryForEstablishmentService,
    );

    createDefaultCategory.execute(account.id);

    const userModel = await this.usersRepository.create({
      ds_login: `administrador@${nm_estabelecimento
        .replace(/\s/g, '')
        .toLowerCase()}.com.br`,
      ds_senha: '$administrador102030$',
      id_estabelecimento: Number(establishment.id),
      id_perfil: 999,
      nm_usuario: 'Administrador',
    });

    return { estabelecimento: establishment, usuario: userModel };
  }
}
