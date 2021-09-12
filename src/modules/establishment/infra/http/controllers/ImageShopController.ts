import { container } from 'tsyringe';
import { Request, Response } from 'express';
import fs from 'fs';
import CreateImageShop from '@modules/establishment/services/CreateImageShop';

import uploadConfig from '@config/uploadImageShop';

export default class ImageShopController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createImageShop = container.resolve(CreateImageShop);

    const { id } = request.params;
    const piece = await createImageShop.execute({
      file: request.file.filename,
      shop_id: Number(id),
    });

    return response.json(piece);
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
