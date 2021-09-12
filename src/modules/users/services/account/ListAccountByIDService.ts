import { inject, injectable } from 'tsyringe';
import Account from '../../infra/typeorm/entities/Account';
import IAccountsRepository from '../../repositories/IAccountsRepository';

@injectable()
export default class ListAccountByIDService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
  ) {}

  public async execute(id: number): Promise<Account | undefined> {
    const account = await this.accountsRepository.findById(id);
    return account;
  }
}
