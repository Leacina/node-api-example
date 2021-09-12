import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import Piece from '../infra/typeorm/entities/Piece';
import ICreatePieceDTO from '../dtos/ICreatePieceDTO';
import IListPieceDTO from '../dtos/IListDTO';
import IFilterPieceDTO from '../dtos/IFilterPieceDTO';

export default interface IBrandRepository {
  create(data: ICreatePieceDTO): Promise<Piece>;
  find(
    data: IListPieceDTO,
    filter: IFilterRequestList,
    filterPiece: IFilterPieceDTO,
  ): Promise<Piece[]>;
  findByShop(data: IListPieceDTO): Promise<Piece[]>;
  findBySpotlight(
    data: IListPieceDTO,
    filter: IFilterRequestList,
  ): Promise<Piece[]>;
  findByCategory(
    id: number,
    cidade: string,
    { id_conta, id_estabelecimento, id_loja }: IListPieceDTO,
    filter: IFilterRequestList,
  ): Promise<Piece[]>;
  findUnion(
    data: IListPieceDTO,
    filter: IFilterRequestList,
    filterPiece: IFilterPieceDTO,
  ): Promise<Piece[]>;
  findByID(id: number, id_conta?: number): Promise<Piece | undefined>;
  delete(id: number): Promise<void>;
  save(data: Piece): Promise<Piece>;
  count(data: IListPieceDTO): Promise<number>;
}
