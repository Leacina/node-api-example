import { getRepository, Repository } from 'typeorm';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ICreatePerfilDTO from '../../../dtos/ICreatePerfilDTO';
import IPerfilRepository from '../../../repositories/IPerfilRepository';

import Perfil from '../entities/Perfil';

class PerfilRepository implements IPerfilRepository {
  private ormRepository: Repository<Perfil>;

  constructor() {
    this.ormRepository = getRepository(Perfil);
  }

  public async create({
    nm_menu,
    tp_perfil,
  }: ICreatePerfilDTO): Promise<Perfil> {
    const perfil = this.ormRepository.create({
      nm_menu,
      tp_perfil,
      cd_perfil: 0,
      dh_inc: new Date(),
    });

    await this.ormRepository.save(perfil);

    return perfil;
  }

  public async findById(id: number): Promise<Perfil | undefined> {
    const perfil = await this.ormRepository.findOne({
      where: {
        id,
      },
    });

    return perfil;
  }

  public async save(perfil: Perfil): Promise<Perfil | undefined> {
    const perfilSave = await this.ormRepository.save(perfil);
    return perfilSave;
  }

  public async find({
    search,
    page,
    pageSize,
  }: IFilterRequestList): Promise<Perfil[]> {
    const searchSplit = search ? search.split(';') : [];

    let where = '';

    if (searchSplit.length === 1) {
      where = `tp_perfil like '%${searchSplit[0]}%'`;
    }

    const perfils = await this.ormRepository.find({
      where: qb => {
        qb.where(where);
      },
      skip: page,
      take: pageSize,
      order: {
        id: 'DESC',
      },
    });
    return perfils;
  }
}

export default PerfilRepository;
