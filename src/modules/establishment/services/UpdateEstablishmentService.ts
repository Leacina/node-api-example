import { injectable, inject } from 'tsyringe';
import * as yup from 'yup';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import Establishment from '../infra/typeorm/entities/Establishment';
import IEstablishmentsRepository from '../repositories/IEstablishmentsRepository';

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

@injectable()
export default class UpdateEstablishmentService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param establishmentsRepository
   */
  constructor(
    @inject('EstablishmentsRepository')
    private establishmentsRepository: IEstablishmentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    establishment_id: number,
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
  ): Promise<Establishment | undefined> {
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

    const establishment = await this.establishmentsRepository.findById(
      establishment_id,
    );

    // Seta as variaveis para alterar
    establishment.cnpj_cpf = cnpj_cpf;
    establishment.id_conta = user.id_conta;
    establishment.nm_estabelecimento = nm_estabelecimento;
    establishment.razao_social = razao_social;
    establishment.responsavel = responsavel;
    establishment.cidade = cidade;
    establishment.estado = estado;
    establishment.quantidade_lojas = quantidade_lojas;
    establishment.telefone_responsavel = telefone_responsavel;

    await this.establishmentsRepository.save(establishment);

    return establishment;
  }
}
