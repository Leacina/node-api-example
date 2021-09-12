/* eslint-disable no-param-reassign */
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import IBudgetsRepository from '../repositories/IBudgetsRepository';
import Budget from '../infra/typeorm/entities/Budget';
import IBudgetItemsRepository from '../repositories/IBudgetItemsRepository';

@injectable()
export default class ListBudgetsByEmailService {
  constructor(
    @inject('BudgetsRepository') private budgetsRepository: IBudgetsRepository,

    @inject('BudgetItemsRepository')
    private budgetItemsRepository: IBudgetItemsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    budget_email: string,
    user_id: number,
    filter?: IFilterRequestList,
  ): Promise<Budget[]> {
    const {
      id_conta,
      id_estabelecimento,
      id_loja,
    } = await this.usersRepository.findById(user_id);

    const budgets = await this.budgetsRepository.findByEmail(
      budget_email,
      {
        id_conta,
        id_estabelecimento,
        id_loja,
      },
      filter,
    );

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < budgets.length; i++) {
      if (budgets[i].situacao === 'P') {
        budgets[i].situacao = 'Pendente';
      } else if (budgets[i].situacao === 'VP') {
        budgets[i].situacao = 'Venda Parcial';
      } else if (budgets[i].situacao === 'VI') {
        budgets[i].situacao = 'Venda Integral';
      } else if (budgets[i].situacao === 'C') {
        budgets[i].situacao = 'Cancelado';
      }

      // eslint-disable-next-line no-await-in-loop
      budgets[i].valor_total = await this.budgetItemsRepository.sum(
        budgets[i].id,
      );
    }

    return budgets;
  }
}
