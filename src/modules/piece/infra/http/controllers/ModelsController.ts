import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CreateModelService from '@modules/piece/services/model/CreateModelService';
import DeleteModelService from '@modules/piece/services/model/DeleteModelService';
import ListModelByIDService from '@modules/piece/services/model/ListModelByIDService';
import ListModelsService from '@modules/piece/services/model/ListModelsService';
import UpdateModelService from '@modules/piece/services/model/UpdateModelService';

export default class ModelsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id_loja, id_estabelecimento, id_marca, modelo } = request.body;
    const createModels = container.resolve(CreateModelService);

    const model = await createModels.execute({
      id_loja,
      id_estabelecimento,
      id_marca,
      modelo,
      user_id: Number(request.user.id),
    });

    return response.json(model);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const listModelById = container.resolve(ListModelByIDService);

    const model = await listModelById.execute({
      id_model: Number(id),
      user_id: Number(request.user.id),
    });

    return response.json(model);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { page, pageSize, search, ignorePage, pagination } = request.query;
    const listModel = container.resolve(ListModelsService);

    const models = await listModel.execute(Number(request.user.id), {
      ignorePage: ignorePage === 'true' || pagination !== 'true',
      search: search ? String(search) : '',
      page: Number(page),
      pageSize: Number(pageSize),
    });

    return response.json(models);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deleteModel = container.resolve(DeleteModelService);

    await deleteModel.execute({
      id: Number(id),
      user_id: Number(request.user.id),
    });

    return response.status(200).send();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_marca, modelo } = request.body;
    const updateModel = container.resolve(UpdateModelService);

    const model = await updateModel.execute({
      model_name: modelo,
      brand_id: Number(id_marca),
      model_id: Number(id),
      user_id: Number(request.user.id),
    });

    return response.json(model);
  }
}
