import { container } from 'tsyringe';
import { Request, Response } from 'express';
import ListModelByBrandService from '@modules/piece/services/model/ListModelByBrandService';

export default class ModelsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const listModelByBrandService = container.resolve(ListModelByBrandService);

    const models = await listModelByBrandService.execute(Number(id));

    return response.json(models);
  }
}
