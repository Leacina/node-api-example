import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListPieceService from '@modules/piece/services/ListPiecesService';

export default class PiecesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const {
      page,
      pageSize,
      search,
      ignorePage,
      ignoreEstablishment,
      pagination,

      // FILTERS
      ano_final,
      ano_inicial,
      categoria,
      descricao,
      marca,
      modelo,
    } = request.query;
    const listPiece = container.resolve(ListPieceService);

    const pieces = await listPiece.execute(
      Number(request.user.id),
      true,
      {
        ignorePage: ignorePage === 'true' || pagination !== 'true',
        ignoreEstablishment:
          ignoreEstablishment === 'true' || pagination !== 'true',
        search: search ? String(search) : '',
        page: Number(page),
        pageSize: Number(pageSize),
      },
      {
        ano_final: ano_final ? Number(ano_final) : 0,
        ano_inicial: ano_inicial ? Number(ano_inicial) : 0,
        categoria: categoria ? String(categoria) : '',
        descricao: descricao ? String(descricao) : '',
        marca: marca ? String(marca) : '',
        modelo: modelo ? String(modelo) : '',
      },
    );

    return response.json(pieces);
  }
}
