import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import Piece from '@modules/piece/infra/typeorm/entities/Piece';
import AppError from '@shared/errors/AppError';
import IPiecesRepository from '../repositories/IPiecesRepository';
import IImagePieceRepository from '../repositories/IImagePieceRepository';

@injectable()
export default class UpdatePieceSpotlightService {
  constructor(
    @inject('PiecesRepository') private piecesRepository: IPiecesRepository,

    @inject('ImagePieceRepository')
    private imagePieceRepository: IImagePieceRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    id: number,
    user_id: number,
    piece_spotlight: number,
  ): Promise<Piece> {
    const user = await this.usersRepository.findById(user_id);
    const piece = await this.piecesRepository.findByID(id, user.id_conta);

    if (piece_spotlight !== 0 && piece_spotlight !== 1) {
      throw new AppError('Valor da peça em destaque informado errado', 401);
    }

    // TODO: Rever essa atribuição
    if (piece) {
      piece.peca_destaque = piece_spotlight;

      await this.piecesRepository.save(piece);
    }

    return piece;
  }
}
