import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: number): Promise<User | undefined>;
  find(
    logist: boolean,
    filter?: IFilterRequestList,
  ): Promise<User[] | undefined>;
  save(user: User): Promise<User | undefined>;
}
