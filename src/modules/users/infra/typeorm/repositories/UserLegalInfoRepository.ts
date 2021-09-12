import { getRepository, Repository } from 'typeorm';
import IUserLegalInfoService from '@modules/users/repositories/IUserLegalInfoRepository';
import ICreateUserLegalInfoDTO from '../../../dtos/ICreateUserLegalInfoDTO';

import UserLegalInfo from '../entities/UserLegalInfo';

class UserLegalInfoRepository implements IUserLegalInfoService {
  private ormRepository: Repository<UserLegalInfo>;

  constructor() {
    this.ormRepository = getRepository(UserLegalInfo);
  }

  public async create(data: ICreateUserLegalInfoDTO): Promise<UserLegalInfo> {
    const user = this.ormRepository.create(data);

    await this.ormRepository.save(user);

    return user;
  }
}

export default UserLegalInfoRepository;
