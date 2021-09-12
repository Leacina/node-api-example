import { Repository, getRepository } from 'typeorm';
import IShopsRepository from '@modules/establishment/repositories/IShopsRepository';
import ICreateShopDTO from '@modules/establishment/dtos/ICreateShopDTO';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import FindFilters from '@shared/utils/implementations/common';
import Shop from '../entities/Shop';

export default class ShopRepository implements IShopsRepository {
  private ormRepository: Repository<Shop>;

  constructor() {
    this.ormRepository = getRepository(Shop);
  }

  async find({
    search,
    page,
    pageSize,
  }: IFilterRequestList): Promise<Shop[] | undefined> {
    const searchSplit = search ? search.split(';') : [];

    const findFilters = new FindFilters(searchSplit);

    let where = '';
    // Se for filtro avançado, procurar por cada campos
    if (searchSplit.length > 1) {
      where = `shop.cidade like '%${findFilters.findSearch('cidade')}%' and
      shop.nm_loja like '%${findFilters.findSearch('nm_loja')}%' and
      estabelecimento.nm_estabelecimento like '%${findFilters.findSearch(
        'estabelecimento',
      )}%'`;
    } else if (searchSplit.length === 1) {
      where = `shop.cidade like '%${searchSplit[0]}%' or
      shop.nm_loja like '%${searchSplit[0]}%' or
      estabelecimento.nm_estabelecimento like '%${searchSplit[0]}%'`;
    }

    const shop = await this.ormRepository.find({
      relations: ['estabelecimento'],
      join: {
        alias: 'shop',
        innerJoin: { estabelecimento: 'shop.estabelecimento' },
      },
      where: qb => {
        qb.where(where);
      },
      skip: page,
      take: pageSize,
      order: {
        id: 'DESC',
      },
    });

    return shop;
  }

  async findById(id: number): Promise<Shop | undefined> {
    const shop = await this.ormRepository.findOne({
      where: {
        id,
      },
      relations: ['estabelecimento'],
    });

    return shop;
  }

  async findByEstablishmentId(id: number): Promise<Shop[] | undefined> {
    const shops = await this.ormRepository.find({
      where: {
        id_estabelecimento: id,
      },
      relations: ['estabelecimento'],
      order: {
        id: 'DESC',
      },
    });

    return shops;
  }

  async findByAccountId(id: number): Promise<Shop[] | undefined> {
    const shop = await this.ormRepository.find({
      where: {
        id_conta: id,
      },
    });

    return shop;
  }

  async create(data: ICreateShopDTO): Promise<Shop | undefined> {
    const shop = this.ormRepository.create({ ...data, dh_inc: new Date() });

    await this.ormRepository.save(shop);

    return shop;
  }

  async save(shop: Shop): Promise<Shop | undefined> {
    const shopModel = this.ormRepository.save(shop);

    return shopModel;
  }
}
