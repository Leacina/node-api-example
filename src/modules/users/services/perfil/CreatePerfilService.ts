// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import * as yup from 'yup';
import AppError from '@shared/errors/AppError';

import Perfil from '../../infra/typeorm/entities/Perfil';
import IPerfilRepository from '../../repositories/IPerfilRepository';
import ICreatePerfilDTO from '../../dtos/ICreatePerfilDTO';

@injectable()
class CreatePerfilService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param perfilRepository
   */
  constructor(
    @inject('PerfilRepository')
    private perfilRepository: IPerfilRepository,
  ) {}

  public async execute({
    nm_menu,
    tp_perfil,
  }: ICreatePerfilDTO): Promise<Perfil> {
    // Validações necessárias para criar o usuário
    const schema = yup.object().shape({
      nm_menu: yup
        .string()
        .nullable(true)
        .required('Nenhum menu foi informado'),
    });

    // Caso houver algum erro retorna com status 422
    await schema
      .validate({
        nm_menu,
      })
      .catch(err => {
        throw new AppError(err.message, 422);
      });

    // Cria a conta
    const perfil = await this.perfilRepository.create({
      nm_menu,
      tp_perfil,
    });

    return perfil;
  }
}

export default CreatePerfilService;
