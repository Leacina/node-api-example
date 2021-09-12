import { inject, injectable } from 'tsyringe';
import Perfil from '../../infra/typeorm/entities/Perfil';
import IPerfilRepository from '../../repositories/IPerfilRepository';

@injectable()
export default class ListPerfilByIDService {
  constructor(
    @inject('PerfilRepository')
    private perfilRepository: IPerfilRepository,
  ) {}

  public async execute(id: number): Promise<Perfil | undefined> {
    const perfil = await this.perfilRepository.findById(id);
    return perfil;
  }
}
