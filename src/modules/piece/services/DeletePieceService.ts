import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IPiecesRepository from '../repositories/IPiecesRepository';

interface IRequest {
  id: number;
  user_id: number;
}

@injectable()
export default class DeletePieceService {
  constructor(
    @inject('PiecesRepository') private piecesRepository: IPiecesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, user_id }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    const piece = await this.piecesRepository.findByID(id, user.id_conta);

    if (piece) {
      await this.piecesRepository.delete(id);
    }
  }
}
