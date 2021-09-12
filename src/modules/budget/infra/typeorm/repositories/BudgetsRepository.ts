import { getRepository, Repository } from 'typeorm';
import IBudgetsRepository from '@modules/budget/repositories/IBudgetsRepository';
import IListDTO from '@modules/piece/dtos/IListDTO';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import IProcessBudgetDTO from '@modules/budget/dtos/IProcessBudgetDTO';
import FindFilters from '@shared/utils/implementations/common';
import ICreateBudgetDTO from '../../../dtos/ICreateBudgetDTO';
import Budget from '../entities/Budget';

// eslint-disable-next-line no-shadow
enum SituationEnum {
  CANCEL = 'C',
  FULL_SALE = 'VI',
  PARTIAL_SALE = 'VP',
  PENDING = 'P',
}

export default class BudgetsRepository implements IBudgetsRepository {
  private ormRepository: Repository<Budget>;

  constructor() {
    this.ormRepository = getRepository(Budget);
  }

  async create(data: ICreateBudgetDTO): Promise<Budget> {
    const budget = this.ormRepository.create({
      ...data,
      dh_inc: new Date(),
    });

    await this.ormRepository.save(budget);

    return budget;
  }

  async find(
    { id_loja, id_estabelecimento, id_conta }: IListDTO,
    { search, page, pageSize }: IFilterRequestList,
  ): Promise<Budget[]> {
    const searchSplit = search ? search.split(';') : [];
    const findFilters = new FindFilters(searchSplit);

    let where = 'true ';

    // Se for filtro avançado, procurar por cada campos
    if (searchSplit.length > 1) {
      where += `and budget.emitente like '%${findFilters.findSearch(
        'emitente',
      )}%' and
      budget.emitente_email like '%${findFilters.findSearch(
        'emitente_email',
      )}%' and
      budget.emitente_telefone like '%${findFilters.findSearch(
        'emitente_telefone',
      )}%'`;
    } else if (searchSplit.length === 1) {
      where += `and (budget.emitente like '%${searchSplit[0]}%' or
      budget.emitente_email like '%${searchSplit[0]}%' or
      budget.emitente_telefone like '%${searchSplit[0]}%')`;
    }

    where += ` and budget.id_estabelecimento = ${id_estabelecimento} and budget.id_loja = ${id_loja}`;

    const budgets = await this.ormRepository.find({
      join: {
        alias: 'budget',
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

    return budgets;
  }

  async findByEmail(
    budget_email: string,
    { id_loja, id_estabelecimento, id_conta }: IListDTO,
    { page, pageSize }: IFilterRequestList,
  ): Promise<Budget[]> {
    const budgets = await this.ormRepository.find({
      where: {
        emitente_email: budget_email,
        // id_conta,
      },
      // skip: page ? page - 1 : 0,
      // take: pageSize + 1 || 11,
      relations: ['loja', 'estabelecimento', 'conta'],
      order: {
        id: 'DESC',
      },
    });

    return budgets;
  }

  async process(
    { budget_id, isConfirm }: IProcessBudgetDTO,
    { id_conta, id_loja, id_estabelecimento }: IListDTO,
  ): Promise<Budget> {
    const budget = await this.ormRepository.findOne({
      where: {
        id: budget_id,
        id_estabelecimento,
        id_loja,
        // id_conta,
      },
    });

    // eslint-disable-next-line no-unused-expressions
    budget as Budget;

    budget.situacao = isConfirm
      ? SituationEnum.FULL_SALE
      : SituationEnum.CANCEL;

    await this.ormRepository.save(budget);

    return budget;
  }

  async findById(
    id: number,
    { id_loja, id_estabelecimento, id_conta }: IListDTO,
  ): Promise<Budget> {
    const budgets = await this.ormRepository.findOne({
      where: {
        id,
        // id_estabelecimento,
        // id_loja,
        // id_conta,
      },
      relations: ['loja', 'estabelecimento', 'conta', 'items'],
    });

    return budgets;
  }
}
