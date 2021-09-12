import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUsersTokensRepository {
  generate(user_id: number): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
  deleteById(user_id: number): Promise<void>;
}
