import { getRepository, Repository } from 'typeorm';
import IBudgetItemsRepository from '@modules/budget/repositories/IBudgetItemsRepository';
import IListDTO from '@modules/piece/dtos/IListDTO';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import IProcessBudgetItemsDTO from '@modules/budget/dtos/IProcessBudgetItemsDTO';
import ICreateBudgetItemDTO from '../../../dtos/ICreateBudgetItemDTO';
import BudgetItem from '../entities/BudgetItem';
import Budget from '../entities/Budget';

// eslint-disable-next-line no-shadow
enum SituationEnum {
  CANCEL = 'C',
  FULL_SALE = 'VI',
  PARTIAL_SALE = 'VP',
  PENDING = 'P',
}

export default class BudgetItemsRepository implements IBudgetItemsRepository {
  private ormRepository: Repository<BudgetItem>;

  private ormRepositoryBudget: Repository<Budget>;

  constructor() {
    this.ormRepository = getRepository(BudgetItem);
    this.ormRepositoryBudget = getRepository(Budget);
  }

  async create(data: ICreateBudgetItemDTO[]): Promise<BudgetItem[]> {
    const budgetItem = this.ormRepository.create(data);

    await this.ormRepository.save(budgetItem);

    return budgetItem;
  }

  async sum(budget_id: number): Promise<number> {
    const budgetItems = await this.ormRepository.find({
      where: {
        id_orcamento: budget_id,
      },
    });

    return budgetItems.reduce((acumulador, current_value) => {
      return Number(acumulador) + Number(current_value.valor);
    }, 0);
  }

  async find(
    budget_id: number,
    { id_loja, id_estabelecimento, id_conta }: IListDTO,
    { page, pageSize }: IFilterRequestList,
  ): Promise<BudgetItem[]> {
    const budgetItems = await this.ormRepository.find({
      where: {
        id_orcamento: budget_id,
      },
      skip: page ? page - 1 : 0,
      take: pageSize + 1 || 11,
      relations: ['orcamento', 'peca', 'conta'],
      order: {
        id: 'DESC',
      },
    });

    return budgetItems;
  }

  async process({
    budget_item_id,
    isConfirm,
  }: IProcessBudgetItemsDTO): Promise<BudgetItem> {
    const budgetItem = await this.ormRepository.findOne({
      where: {
        id: budget_item_id,
        // id_conta,
      },
    });

    // Altera estado produto
    budgetItem.situacao = isConfirm ? 'Confirmado' : 'Cancelado';

    // Save
    await this.ormRepository.save(budgetItem);

    // Busca para verificar se todos estão cancelados/confirmados/pendentes
    const budgetItems = await this.ormRepository.find({
      where: {
        id_orcamento: budgetItem.id_orcamento,
      },
    });

    // Busca todos os itens cancelados
    const cancel_sale = budgetItems.filter(item => {
      return item.situacao === 'Cancelado';
    });

    // Busca todos os itens pendentes
    const pending = budgetItems.filter(item => {
      return item.situacao === 'Pendente';
    });

    // Busca o orçamento para alterar a situação
    const budget = await this.ormRepositoryBudget.findOne({
      where: {
        id: budgetItem.id_orcamento,
      },
    });

    // Somentee muda a situação se não tiver nada pendente
    if (pending.length === 0) {
      // Se todos estiverem cancelados, mostra como cancelado a venda
      if (cancel_sale.length === budgetItems.length) {
        budget.situacao = SituationEnum.CANCEL;
      }
      // Se possuir somente alguns cancelados e nenhum pendente
      // foi uma venda parcial
      else if (cancel_sale.length > 0) {
        budget.situacao = SituationEnum.PARTIAL_SALE;
      }
      // Se for vendido tudo, venda integral
      else {
        budget.situacao = SituationEnum.FULL_SALE;
      }
    } else {
      budget.situacao = SituationEnum.PENDING;
    }

    // Save
    await this.ormRepositoryBudget.save(budget);

    return budgetItem;
  }
}
