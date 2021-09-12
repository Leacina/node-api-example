// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import * as yup from 'yup';
import AppError from '@shared/errors/AppError';

import IUserLegalInfoService from '../repositories/IUserLegalInfoRepository';
import IUserRepository from '../repositories/IUserRepository';

import UserLegalInfo from '../infra/typeorm/entities/UserLegalInfo';
import ICreateUserLegalInfoDTO from '../dtos/ICreateUserLegalInfoDTO';

@injectable()
class CreateUserService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param usersRepository
   */
  constructor(
    @inject('UserLegalInfoRepository')
    private usersLegalInfoRepository: IUserLegalInfoService,

    @inject('UsersRepository')
    private usersRepository: IUserRepository,
  ) {}

  public async execute(data: ICreateUserLegalInfoDTO): Promise<UserLegalInfo> {
    // Validações necessárias para criar o usuário
    const schema = yup.object().shape({
      razao_social: yup.string().required('Razão social é obrigatório'),
      nome_fantasia: yup
        .string()
        .required('O campo nome fantasia não foi informado'),
      cnpj: yup.string().required('O campo cnpj não foi informado'),
      // id_conta: yup.number().required('O campo conta não foi informado'),
      inscricao_estadual: yup
        .string()
        .required('O campo inscrição estadual não foi informado'),
      telefone: yup.string().required('O campo telefone não foi informado'),
    });

    // Caso houver algum erro retorna com status 422
    await schema.validate(data).catch(err => {
      throw new AppError(err.message, 422);
    });

    const user = await this.usersRepository.findById(data.id_usuario || 0);

    if (!user) {
      throw new AppError('Usuário não encontrado', 400);
    }

    // Cria o usuario
    const userLegalInfo = await this.usersLegalInfoRepository.create({
      ...data,
    });

    return userLegalInfo;
  }
}

export default CreateUserService;
