import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IBudgetsRepository from '../repositories/IBudgetsRepository';
import Budget from '../infra/typeorm/entities/Budget';

@injectable()
export default class ListBudgetsByIdService {
  constructor(
    @inject('BudgetsRepository') private budgetsRepository: IBudgetsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: number, user_id: number): Promise<Budget> {
    const {
      id_conta,
      id_estabelecimento,
      id_loja,
    } = await this.usersRepository.findById(user_id);

    const budgets = await this.budgetsRepository.findById(id, {
      id_conta,
      id_estabelecimento,
      id_loja,
    });

    if (budgets.situacao === 'P') {
      budgets.situacao = 'Pendente';
    } else if (budgets.situacao === 'VP') {
      budgets.situacao = 'Venda Parcial';
    } else if (budgets.situacao === 'VI') {
      budgets.situacao = 'Venda Integral';
    } else if (budgets.situacao === 'C') {
      budgets.situacao = 'Cancelado';
    }

    return budgets;
  }
}
