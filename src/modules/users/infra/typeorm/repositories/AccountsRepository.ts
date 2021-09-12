import { getRepository, Repository } from 'typeorm';
import IAccountsRepository from '@modules/users/repositories/IAccountsRepository';
import ICreateAccountDTO from '../../../dtos/ICreateAccountDTO';

import Account from '../entities/Account';

class AccountsRepository implements IAccountsRepository {
  private ormRepository: Repository<Account>;

  constructor() {
    this.ormRepository = getRepository(Account);
  }

  public async create({
    id,
    is_anuncio,
    nm_conta,
    is_ativo,
  }: ICreateAccountDTO): Promise<Account> {
    const account = this.ormRepository.create({
      id,
      is_anuncio,
      nm_conta,
      is_ativo,
      dh_inc: new Date(),
    });

    await this.ormRepository.save(account);

    return account;
  }

  public async findById(id: number): Promise<Account | undefined> {
    const account = await this.ormRepository.findOne(id);
    return account;
  }
}

export default AccountsRepository;
