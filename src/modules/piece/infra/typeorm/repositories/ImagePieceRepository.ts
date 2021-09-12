import { getRepository, Repository } from 'typeorm';
import IImagePieceRepository from '@modules/piece/repositories/IImagePieceRepository';
import ICreateImagePieceDTO from '@modules/piece/dtos/ICreateImagePieceDTO';
import ImagePiece from '../entities/ImagePiece';

class ImagePieceRepository implements IImagePieceRepository {
  private ormRepository: Repository<ImagePiece>;

  constructor() {
    this.ormRepository = getRepository(ImagePiece);
  }

  async findByPieceID(id: number): Promise<ImagePiece[]> {
    const image = await this.ormRepository.find({
      // where,
      where: {
        id_produto: id,
      },
      relations: ['produto'],
    });

    return image;
  }

  async deleteByPieceId(id: number): Promise<void> {
    await this.ormRepository.delete({ id_produto: id });
  }

  async save(data: ImagePiece): Promise<ImagePiece> {
    const model = await this.ormRepository.save(data);
    return model;
  }

  async findByImagemName(image: string): Promise<ImagePiece> {
    const imageModel = await this.ormRepository.findOne({
      where: {
        imagem: image,
      },
    });

    return imageModel;
  }

  async create(data: ICreateImagePieceDTO): Promise<ImagePiece> {
    const image = this.ormRepository.create({
      ...data,
      dh_inc: new Date(),
    });

    await this.ormRepository.save(image);

    return image;
  }
}

export default ImagePieceRepository;
