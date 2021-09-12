import { getRepository, Repository } from 'typeorm';
import IEstablishmentsRepository from '@modules/establishment/repositories/IEstablishmentsRepository';
import ICreateEstablishmentDTO from '@modules/establishment/dtos/ICreateEstablishmentDto';

import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import FindFilters from '@shared/utils/implementations/common';
import Establishment from '../entities/Establishment';

export default class EstablishmentRepository
  implements IEstablishmentsRepository {
  private ormRepository: Repository<Establishment>;

  constructor() {
    this.ormRepository = getRepository(Establishment);
  }

  async findById(id: number): Promise<Establishment | undefined> {
    const establishment = await this.ormRepository.findOne(id);
    return establishment;
  }

  async findByAccountId(id: number): Promise<Establishment[] | undefined> {
    const establishment = await this.ormRepository.find({
      where: { id_conta: id },
      order: {
        id: 'DESC',
      },
    });

    return establishment;
  }

  async find({
    search,
    page,
    pageSize,
  }: IFilterRequestList): Promise<Establishment[] | undefined> {
    const searchSplit = search ? search.split(';') : [];
    const findFilters = new FindFilters(searchSplit);

    let where = '';

    // Se for filtro avançado, procurar por cada campos
    if (searchSplit.length > 1) {
      where = `cidade like '%${findFilters.findSearch('cidade')}%' and
      nm_estabelecimento like '%${findFilters.findSearch(
        'nm_estabelecimento',
      )}%' and
      responsavel like '%${findFilters.findSearch('responsavel')}%'`;
    } else if (searchSplit.length === 1) {
      where = `cidade like '%${searchSplit[0]}%' or
      nm_estabelecimento like '%${searchSplit[0]}%' or
      responsavel like '%${searchSplit[0]}%'`;
    }

    const establishment = await this.ormRepository.find({
      where: qb => {
        qb.where(where);
      },
      skip: page,
      take: pageSize,
      order: {
        id: 'DESC',
      },
    });

    return establishment;
  }

  async create(
    data: ICreateEstablishmentDTO,
  ): Promise<Establishment | undefined> {
    const establishmentObject = { ...data, dh_inc: new Date() };
    const establishment = this.ormRepository.create(establishmentObject);

    await this.ormRepository.save(establishment);

    return establishment;
  }

  async save(establishment: Establishment): Promise<Establishment> {
    return this.ormRepository.save(establishment);
  }
}
