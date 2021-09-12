import { container } from 'tsyringe';
import { Request, Response } from 'express';
import ListTypesPieceRepository from '@modules/piece/services/ListTypesPieceRepository';

export default class ModelsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listTypesPieceRepository = container.resolve(
      ListTypesPieceRepository,
    );

    const { page, pageSize } = request.query;

    const types = await listTypesPieceRepository.execute({
      page: Number(page),
      pageSize: Number(pageSize),
    });

    return response.json(types);
  }
}
