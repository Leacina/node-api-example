import ImagePiece from '../infra/typeorm/entities/ImagePiece';
import ICreateImagePieceDTO from '../dtos/ICreateImagePieceDTO';

export default interface IImagePieceRepository {
  findByPieceID(id: number): Promise<ImagePiece[] | undefined>;
  deleteByPieceId(id: number): Promise<void>;
  save(data: ImagePiece): Promise<ImagePiece>;
  findByImagemName(image: string): Promise<ImagePiece>;
  create(data: ICreateImagePieceDTO): Promise<ImagePiece>;
}
