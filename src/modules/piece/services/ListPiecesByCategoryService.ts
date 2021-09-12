import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IPiecesRepository from '../repositories/IPiecesRepository';
import IListPieceDTO from '../dtos/IListDTO';
import Piece from '../infra/typeorm/entities/Piece';

interface IRequest {
  user_id: number;
  id: number;
  cidade?: string;
  filter?: IFilterRequestList;
  data: IListPieceDTO;
}

@injectable()
export default class ListPiecesByCategoryService {
  constructor(
    @inject('PiecesRepository') private piecesRepository: IPiecesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    id,
    cidade,
    user_id,
    filter,
    data,
  }: IRequest): Promise</* IResponseList */ Piece[]> {
    const { id_estabelecimento, id_loja } =
      data.id_estabelecimento || data.id_loja
        ? { id_estabelecimento: data.id_estabelecimento, id_loja: data.id_loja }
        : { id_estabelecimento: 0, id_loja: 0 };

    const pieces = await this.piecesRepository.findByCategory(
      id,
      cidade,
      { id_estabelecimento, id_loja },
      filter,
    );

    //    return new ListResponse(pieces, filter.page, filter.pageSize, true);
    return pieces;
  }
}
