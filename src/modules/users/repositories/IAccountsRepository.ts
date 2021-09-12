import Account from '../infra/typeorm/entities/Account';
import ICreateAccountDTO from '../dtos/ICreateAccountDTO';

export default interface IAccounntsRepository {
  create(data: ICreateAccountDTO): Promise<Account>;
  findById(id: number): Promise<Account | undefined>;
}
