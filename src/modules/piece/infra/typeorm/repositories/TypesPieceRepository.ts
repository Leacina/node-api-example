import { getRepository, Repository } from 'typeorm';
import IListDTO from '@modules/piece/dtos/IListDTO';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ITypesPieceRepository from '@modules/piece/repositories/ITypesPieceRepository';
import TypePiece from '../entities/TypePiece';

class TypesPiece implements ITypesPieceRepository {
  private ormRepository: Repository<TypePiece>;

  constructor() {
    this.ormRepository = getRepository(TypePiece);
  }

  async find(): Promise<TypePiece[]> {
    const types = await this.ormRepository.find({
      order: {
        nome: 'DESC',
      },
    });

    return types;
  }
}

export default TypesPiece;
