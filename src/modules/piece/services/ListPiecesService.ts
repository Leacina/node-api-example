import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IPiecesRepository from '../repositories/IPiecesRepository';
import IFilterPieceDTO from '../dtos/IFilterPieceDTO';

@injectable()
export default class ListPiecesService {
  constructor(
    @inject('PiecesRepository')
    private piecesRepository: IPiecesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    user_id: number,
    union: boolean,
    filterPage?: IFilterRequestList,
    filterPiece?: IFilterPieceDTO,
  ): Promise<IResponseList> {
    const {
      id_estabelecimento,
      id_loja,
      id_conta,
    } = await this.usersRepository.findById(user_id);

    let pieces;

    if (union) {
      pieces = await this.piecesRepository.findUnion(
        {
          id_estabelecimento,
          id_loja,
          id_conta,
        },
        filterPage,
        filterPiece,
      );
    } else {
      pieces = await this.piecesRepository.find(
        {
          id_estabelecimento,
          id_loja,
          id_conta,
        },
        filterPage,
        filterPiece,
      );
    }

    return new ListResponse(
      pieces,
      filterPage.page,
      filterPage.pageSize,
      filterPage.ignorePage,
    );
  }
}
