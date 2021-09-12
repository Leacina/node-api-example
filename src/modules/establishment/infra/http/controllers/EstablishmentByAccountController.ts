import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListEstablishmentsByAccountIDService from '@modules/establishment/services/ListEstablishmentsByAccountIDService';

export default class EstablishmentByAccountController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const listEstablishmentsByAccount = container.resolve(
      ListEstablishmentsByAccountIDService,
    );
    const establishment = await listEstablishmentsByAccount.execute(Number(id));

    return response.json(establishment);
  }
}
