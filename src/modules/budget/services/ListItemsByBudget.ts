import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IBudgetItemsRepository from '../repositories/IBudgetItemsRepository';

@injectable()
export default class ListBudgetItemsService {
  constructor(
    @inject('BudgetItemsRepository')
    private budgetItemsRepository: IBudgetItemsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    budget_id: number,
    user_id: number,
    filter?: IFilterRequestList,
  ): Promise<IResponseList> {
    const {
      id_conta,
      id_estabelecimento,
      id_loja,
    } = await this.usersRepository.findById(user_id);

    const pieces = await this.budgetItemsRepository.find(
      budget_id,
      {
        id_conta,
        id_estabelecimento,
        id_loja,
      },
      filter,
    );

    return new ListResponse(pieces, filter.page, filter.pageSize);
  }
}
