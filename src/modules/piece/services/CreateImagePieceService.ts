import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/uploadImagePiece';
import { injectable, inject } from 'tsyringe';
import IImagePieceRepository from '../repositories/IImagePieceRepository';
import ImagePiece from '../infra/typeorm/entities/ImagePiece';
import IPiecesRepository from '../repositories/IPiecesRepository';

interface IRequest {
  piece_id: number;
  files: string[];
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('ImagePieceRepository')
    private imagePieceRepository: IImagePieceRepository,

    @inject('PiecesRepository') private piecesRepository: IPiecesRepository,
  ) {}

  public async execute({ piece_id, files }: IRequest): Promise<ImagePiece[]> {
    const images = await this.imagePieceRepository.findByPieceID(
      Number(piece_id),
    );

    images.map(async image => {
      if (image.imagem) {
        const pieceFilePath = path.join(uploadConfig.directory, image.imagem);
        const pieceAvatarFileExists = await fs.promises.stat(pieceFilePath);

        if (pieceAvatarFileExists) {
          await fs.promises.unlink(pieceFilePath);
        }
      }
    });

    await this.imagePieceRepository.deleteByPieceId(Number(piece_id));

    const newImages = new Array<ImagePiece>();

    let countFiles = 0;

    const piece = await this.piecesRepository.findByID(piece_id);
    const URL_IMAGE = 'https://bateuweb.com.br/api/peca/imagem/';

    files.map(async file => {
      countFiles += 1;

      console.log('Cadastrando imagem');

      if (countFiles === 1) {
        piece.ds_imagem = URL_IMAGE + file;
      }

      if (countFiles === 2) {
        piece.ds_imagem_dois = URL_IMAGE + file;
      }

      if (countFiles === 3) {
        piece.ds_imagem_tres = URL_IMAGE + file;
      }

      const image = await this.imagePieceRepository.create({
        id_produto: Number(piece_id),
        imagem: file,
      });

      return newImages.push(image);
    });

    await this.piecesRepository.save(piece);

    return newImages;
  }
}

export default UpdateUserAvatarService;
