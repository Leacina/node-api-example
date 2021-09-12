import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListPiecesByShopService from '@modules/piece/services/ListPiecesByShopService';

export default class PiecesByShopController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { page, pageSize } = request.query;
    const listPieceByShop = container.resolve(ListPiecesByShopService);

    const piece = await listPieceByShop.execute({
      id_loja: Number(id),
      filter: { page: Number(page), pageSize: Number(pageSize) },
      user_id: Number(request.user.id),
    });

    return response.json(piece);
  }
}
