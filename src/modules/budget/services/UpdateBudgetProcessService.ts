import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IBudgetsRepository from '../repositories/IBudgetsRepository';
import Budget from '../infra/typeorm/entities/Budget';

interface IRequest {
  budget_id: number;
  isConfirm: boolean;
}

@injectable()
export default class UpdateBudgetProcessService {
  constructor(
    @inject('BudgetsRepository')
    private budgetsRepository: IBudgetsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    { budget_id, isConfirm }: IRequest,
    user_id: number,
  ): Promise<Budget> {
    const {
      id_conta,
      id_estabelecimento,
      id_loja,
    } = await this.usersRepository.findById(user_id);

    const budget = await this.budgetsRepository.process(
      { budget_id, isConfirm },
      {
        id_conta,
        id_estabelecimento,
        id_loja,
      },
    );

    return budget;
  }
}
