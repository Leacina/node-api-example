/* eslint-disable no-param-reassign */
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IBudgetsRepository from '../repositories/IBudgetsRepository';

@injectable()
export default class ListBudgetsService {
  constructor(
    @inject('BudgetsRepository') private budgetsRepository: IBudgetsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    user_id: number,
    filter?: IFilterRequestList,
  ): Promise<IResponseList> {
    const {
      id_conta,
      id_estabelecimento,
      id_loja,
    } = await this.usersRepository.findById(user_id);

    const budgets = await this.budgetsRepository.find(
      {
        id_conta,
        id_estabelecimento,
        id_loja,
      },
      filter,
    );

    budgets.map(async budget => {
      if (budget.situacao === 'P') {
        budget.situacao = 'Pendente';
      } else if (budget.situacao === 'VP') {
        budget.situacao = 'Venda Parcial';
      } else if (budget.situacao === 'VI') {
        budget.situacao = 'Venda Integral';
      } else if (budget.situacao === 'C') {
        budget.situacao = 'Cancelado';
      }

      return budget;
    });

    return new ListResponse(budgets, filter.page, filter.pageSize);
  }
}
