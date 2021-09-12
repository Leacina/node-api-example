import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListPieceBySpotlightService from '@modules/piece/services/ListPieceBySpotlightService';
import UpdatePieceSpotlight from '@modules/piece/services/UpdatePieceSpotlight';

export default class PiecesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { page, pageSize, search } = request.query;
    const listPieceBySpotlightService = container.resolve(
      ListPieceBySpotlightService,
    );

    const pieces = await listPieceBySpotlightService.execute(
      Number(request.user.id),
      {
        search: search ? String(search) : '',
        page: Number(page),
        pageSize: Number(pageSize),
      },
    );

    return response.json(pieces);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, peca_destaque } = request.params;
    const updatePieceSpotlight = container.resolve(UpdatePieceSpotlight);

    const brand = await updatePieceSpotlight.execute(
      Number(id),
      Number(request.user.id),
      Number(peca_destaque),
    );

    return response.json(brand);
  }
}
