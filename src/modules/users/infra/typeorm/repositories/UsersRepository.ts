import { getRepository, Repository } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import FindFilters from '@shared/utils/implementations/common';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  private searchSplit;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({
    ds_login,
    tp_usuario,
    ds_senha,
    telefone,
    nm_usuario,
    is_ativo,
    id_perfil,
    id_loja,
    id_estabelecimento,
    id_conta,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      ds_login,
      tp_usuario,
      ds_senha,
      telefone,
      nm_usuario,
      is_ativo,
      id_perfil,
      id_loja,
      id_estabelecimento,
      id_conta,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        ds_login: email,
      },
    });

    return user;
  }

  public async findById(id: number): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        id,
      },
    });

    return user;
  }

  public async find(
    logist: boolean,
    { page, pageSize, search }: IFilterRequestList,
  ): Promise<User[] | undefined> {
    this.searchSplit = search ? search.split(';') : [];
    this.getWhere(logist);
    const user = await this.ormRepository.find({
      join: this.getJoin(logist),
      where: qb => {
        qb.where(this.getWhere(logist));
      },
      skip: page ? page - 1 : 0,
      take: pageSize + 1 || 11,
      relations: ['loja', 'estabelecimento', 'conta', 'perfil'],
      order: {
        id: 'DESC',
      },
    });

    if (logist) {
      return user.filter(
        model =>
          model.id_estabelecimento !== null &&
          String(model.id_estabelecimento) !== '0',
      );
    }

    return user.filter(
      model =>
        model.id_estabelecimento === null ||
        String(model.id_estabelecimento) === '0',
    );
  }

  public async save(user: User): Promise<User | undefined> {
    const userSave = await this.ormRepository.save(user);
    return userSave;
  }

  /** UTILS */
  getWhere(logist: boolean): string {
    const findFilters = new FindFilters(this.searchSplit);

    let where = 'true ';
    if (logist) {
      // Se for filtro avançado, procurar por cada campos
      if (this.searchSplit.length > 1) {
        where = `and estabelecimento.nm_estabelecimento like '%${findFilters.findSearch(
          'nm_estabelecimento',
        )}%' and
      loja.nm_loja like '%${findFilters.findSearch('nm_loja')}%' and
      nm_usuario like '%${findFilters.findSearch(
        'nm_usuario',
      )}%' and ds_login like '%${findFilters.findSearch('ds_login')}%'`;
      } else if (this.searchSplit.length === 1) {
        where = `and estabelecimento.nm_estabelecimento like '%${this.searchSplit[0]}%' or
      loja.nm_loja like '%${this.searchSplit[0]}%' or
      nm_usuario like '%${this.searchSplit[0]}%' or ds_login like '%${this.searchSplit[0]}%'`;
      }

      return `${where}`;
    }

    if (this.searchSplit.length > 1) {
      where = `nm_usuario like '%${findFilters.findSearch(
        'nm_usuario',
      )}%' and ds_login like '%${findFilters.findSearch('ds_login')}%'`;
    } else if (this.searchSplit.length === 1) {
      where = `nm_usuario like '%${this.searchSplit[0]}%' or ds_login like '%${this.searchSplit[0]}%'`;
    }

    return `${where} and (user.id_estabelecimento is null or user.id_estabelecimento = 0 or user.id_estabelecimento = '')`;
  }

  getJoin(logist: boolean): any {
    if (logist) {
      return {
        alias: 'user',
        innerJoin: {
          estabelecimento: 'user.estabelecimento',
          loja: 'user.loja',
        },
      };
    }

    return {
      alias: 'user',
    };
  }
}

export default UsersRepository;
