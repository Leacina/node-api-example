import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import Piece from '@modules/piece/infra/typeorm/entities/Piece';
import IPiecesRepository from '../repositories/IPiecesRepository';

interface IRequest {
  piece_id: number;
  user_id: number;
}

@injectable()
export default class ListPieceByIDService {
  constructor(
    @inject('PiecesRepository') private piecesRepository: IPiecesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ piece_id, user_id }: IRequest): Promise<Piece> {
    const user = await this.usersRepository.findById(user_id);

    const piece = await this.piecesRepository.findByID(piece_id, user.id_conta);

    return piece;
  }
}
