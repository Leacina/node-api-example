import { container } from 'tsyringe';
import { Request, Response } from 'express';
import fs from 'fs';
import CreateImagePieceService from '@modules/piece/services/CreateImagePieceService';
import ListImagePieceService from '@modules/piece/services/ListImagePieceService';
import sharp from 'sharp';

import uploadConfig from '@config/uploadImagePiece';

export default class ImagePieceController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createPieces = container.resolve(CreateImagePieceService);
    const { id } = request.params;

    const files = [];
    if (request.files) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < request.files.length; i++) {
        files.push(request.files[i].filename);
      }
    }

    const piece = await createPieces.execute({
      files,
      piece_id: Number(id),
    });

    return response.json(piece);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const listImagePieceService = container.resolve(ListImagePieceService);

    const model = await listImagePieceService.execute(Number(id));

    return response.json(model);
  }

  public async index(request: Request, response: Response): Promise<any> {
    const { filename } = request.params;
    const file = `${uploadConfig.directory}/${filename}`;

    fs.stat(file, err => {
      if (err) {
        return response.status(404).end('Imagem não encontrada');
      }

      return response.sendFile(file);
    });
  }
}
