import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreatePerfilService from '@modules/users/services/perfil/CreatePerfilService';
import ListPerfilByIDService from '@modules/users/services/perfil/ListPerfilByIDService';
import ListPerfilService from '@modules/users/services/perfil/ListPerfilService';
import UpdatePerfilService from '@modules/users/services/perfil/UpdatePerfilService';

export default class PerfilController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createPerfilService = container.resolve(CreatePerfilService);
    const perfil = await createPerfilService.execute(request.body);

    return response.json(perfil);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const listPerfilByIDService = container.resolve(ListPerfilByIDService);
    const perfil = await listPerfilByIDService.execute(Number(id));

    return response.json(perfil);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const updatePerfilService = container.resolve(UpdatePerfilService);
    const perfil = await updatePerfilService.execute(Number(id), request.body);

    return response.json(perfil);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { page, pageSize, search } = request.query;

    const listPerfilService = container.resolve(ListPerfilService);

    const perfil = await listPerfilService.execute({
      search: search ? String(search) : '',
      page: Number(page),
      pageSize: Number(pageSize),
    });

    return response.json(perfil);
  }
}
