import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import IListDTO from '../dtos/IListDTO';
import TypePiece from '../infra/typeorm/entities/TypePiece';

export default interface ITypesPieceRepository {
  find(data?: IListDTO, filter?: IFilterRequestList): Promise<TypePiece[]>;
}
