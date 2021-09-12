import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListShopByIDService from '@modules/establishment/services/ListShopByIDService';
import ListShopService from '@modules/establishment/services/ListShopService';
import CreateShopService from '@modules/establishment/services/CreateShopService';
import UpdateShopService from '@modules/establishment/services/UpdateShopService';

export default class UserController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const listShop = container.resolve(ListShopByIDService);

    const shop = await listShop.execute(Number(id));

    return response.json(shop);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { page, pageSize, search } = request.query;
    const listShopService = container.resolve(ListShopService);

    const shop = await listShopService.execute({
      search: search ? String(search) : '',
      page: Number(page),
      pageSize: Number(pageSize),
    });

    return response.json(shop);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const createShop = container.resolve(CreateShopService);
    const shop = await createShop.execute(request.body);

    return response.json(shop);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const updateShopService = container.resolve(UpdateShopService);

    const shop = await updateShopService.execute(Number(id), request.body);

    return response.json(shop);
  }
}
