import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ICreatePerfilDTO from '../dtos/ICreatePerfilDTO';
import Perfil from '../infra/typeorm/entities/Perfil';

export default interface IPerfilRepository {
  create(data: ICreatePerfilDTO): Promise<Perfil>;
  findById(id: number): Promise<Perfil | undefined>;
  find(filter?: IFilterRequestList): Promise<Perfil[] | undefined>;
  save(peerfil: Perfil): Promise<Perfil | undefined>;
}
