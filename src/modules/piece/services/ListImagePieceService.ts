import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IImagePieceRepository from '../repositories/IImagePieceRepository';

@injectable()
export default class ListImagePiecesService {
  constructor(
    @inject('ImagePieceRepository')
    private imagePieceRepository: IImagePieceRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(piece_id: number): Promise<IResponseList> {
    const pieces = await this.imagePieceRepository.findByPieceID(piece_id);

    return new ListResponse(pieces, 0, 0);
  }
}
