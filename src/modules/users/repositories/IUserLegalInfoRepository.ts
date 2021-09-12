import UserLegalInfo from '@modules/users/infra/typeorm/entities/UserLegalInfo';
import ICreateUserLegalInfoDTO from '@modules/users/dtos/ICreateUserLegalInfoDTO';

export default interface IUsersRepository {
  create(data: ICreateUserLegalInfoDTO): Promise<UserLegalInfo>;
}
