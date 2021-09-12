import { getRepository, Repository } from 'typeorm';
import IQuotationsRepository from '@modules/quotation/repositories/IQuotationsRepository';
import IListDTO from '@modules/piece/dtos/IListDTO';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import FindFilters from '@shared/utils/implementations/common';
import ICreateQuotationDTO from '../../../dtos/ICreateQuotationDTO';
import Quotation from '../entities/Quotation';

export default class QuotationItemsRepository implements IQuotationsRepository {
  private ormRepository: Repository<Quotation>;

  constructor() {
    this.ormRepository = getRepository(Quotation);
  }

  async create(data: ICreateQuotationDTO): Promise<Quotation> {
    const quotation = this.ormRepository.create({
      ...data,
      dh_inc: new Date(),

      is_visualizado_cliente: 1,
    });

    await this.ormRepository.save(quotation);

    return quotation;
  }

  async find(
    { id_loja, id_estabelecimento, id_conta }: IListDTO,
    { search, page, pageSize }: IFilterRequestList,
  ): Promise<Quotation[]> {
    const searchSplit = search ? search.split(';') : [];
    const findFilters = new FindFilters(searchSplit);

    let where = 'true ';

    // Se for filtro avançado, procurar por cada campos
    if (searchSplit.length > 1) {
      where += `and quotation.emitente like '%${findFilters.findSearch(
        'emitente',
      )}%' and
      quotation.identificador_cotacao like '%${findFilters.findSearch(
        'identificador_cotacao',
      )}%' and
      quotation.emitente_telefone like '%${findFilters.findSearch(
        'emitente_telefone',
      )}%'`;
    } else if (searchSplit.length === 1) {
      where += `and (quotation.emitente like '%${searchSplit[0]}%' or
      quotation.emitente_email like '%${searchSplit[0]}%' or
      quotation.emitente_telefone like '%${searchSplit[0]}%')`;
    }

    where += ` and quotation.id_estabelecimento = ${id_estabelecimento} and quotation.id_loja = ${id_loja}`;

    const quotations = await this.ormRepository.find({
      join: {
        alias: 'quotation',
      },
      where: qb => {
        qb.where(where);
      },
      skip: page ? page - 1 : 0,
      take: pageSize + 1 || 11,
      relations: ['loja', 'estabelecimento', 'conta', 'items'],
      order: {
        id: 'DESC',
      },
    });

    return quotations;
  }

  async findByEmail(
    budget_email: string,
    { id_loja, id_estabelecimento, id_conta }: IListDTO,
    { page, pageSize, search }: IFilterRequestList,
    isViewAll: number,
  ): Promise<Quotation[]> {
    const searchSplit = search ? search.split(';') : [];
    const findFilters = new FindFilters(searchSplit);

    let where = 'true ';

    // Se for filtro avançado, procurar por cada campos
    if (searchSplit.length > 1) {
      where += `and quotation.identificador_cotacao like '%${findFilters.findSearch(
        'identificador_cotacao',
      )}%' and loja.nm_loja like '%${findFilters.findSearch('nm_loja')}%'`;
    } else if (searchSplit.length === 1) {
      where += `and (quotation.emitente like '%${searchSplit[0]}% or loja.nm_loja like '%${searchSplit[0]}%)'`;
    }

    where += ` and quotation.emitente_email = '${budget_email}'`;

    if (isViewAll === 1) {
      where += ` and quotation.is_visualizado_cliente = 1`;
    }

    const quotations = await this.ormRepository.find({
      join: {
        alias: 'quotation',
        leftJoin: {
          loja: 'quotation.loja',
        },
      },

      where: qb => {
        qb.where(where);
      },
      skip: page ? page - 1 : 0,
      take: pageSize + 1 || 11,
      relations: ['loja', 'estabelecimento', 'conta', 'items'],
      order: {
        id: 'DESC',
      },
    });

    return quotations;
  }

  async findById(id: number): Promise<Quotation> {
    const quotation = await this.ormRepository.findOne({
      where: {
        id,
      },
      relations: ['loja'],
    });

    return quotation;
  }

  async processView(id: number, isView: number): Promise<Quotation> {
    const quotation = await this.ormRepository.findOne({
      where: {
        id,
      },
    });

    // eslint-disable-next-line no-unused-expressions
    quotation as Quotation;

    // Altera estado da cotação
    quotation.is_visualizado_cliente = isView;

    // Save
    await this.ormRepository.save(quotation);

    return quotation;
  }
}
