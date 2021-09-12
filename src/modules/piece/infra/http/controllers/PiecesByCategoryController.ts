import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListPiecesByCategoryService from '@modules/piece/services/ListPiecesByCategoryService';

export default class PiecesByShopController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id, cidade } = request.params;
    const { page, pageSize, estabelecimento, loja } = request.query;

    const listPieceByCategory = container.resolve(ListPiecesByCategoryService);

    const piece = await listPieceByCategory.execute({
      id: Number(id),
      cidade: cidade || '',
      filter: { page: Number(page), pageSize: Number(pageSize) },
      user_id: Number(request.user.id),
      data: {
        id_estabelecimento: Number(estabelecimento),
        id_loja: Number(loja),
      },
    });

    return response.json(piece);
  }
}
