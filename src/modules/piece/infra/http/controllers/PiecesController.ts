import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CreatePieceService from '@modules/piece/services/CreatePieceService';
import DeletePieceService from '@modules/piece/services/DeletePieceService';
import ListPieceByIDService from '@modules/piece/services/ListPieceByIDService';
import ListPieceService from '@modules/piece/services/ListPiecesService';
import UpdatePieceService from '@modules/piece/services/UpdatePieceService';

export default class PiecesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createPieces = container.resolve(CreatePieceService);

    const piece = await createPieces.execute({
      ...request.body,
      user_id: Number(request.user.id),
    });

    return response.json(piece);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const listPieceById = container.resolve(ListPieceByIDService);

    const piece = await listPieceById.execute({
      piece_id: Number(id),
      user_id: Number(request.user.id),
    });

    return response.json(piece);
  }

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
      false,
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

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deletePiece = container.resolve(DeletePieceService);

    await deletePiece.execute({
      id: Number(id),
      user_id: Number(request.user.id),
    });

    return response.status(200).send();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const updatePiece = container.resolve(UpdatePieceService);

    const brand = await updatePiece.execute({
      id,
      ...request.body,
      user_id: Number(request.user.id),
    });

    return response.json(brand);
  }
}
