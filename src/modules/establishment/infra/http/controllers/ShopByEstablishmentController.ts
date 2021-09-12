import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListShopByEstablishmentIdService from '@modules/establishment/services/ListShopByEstablishmentIdService';

export default class ShopByAccountController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const listShopByEstablishmentIdService = container.resolve(
      ListShopByEstablishmentIdService,
    );
    const shop = await listShopByEstablishmentIdService.execute(Number(id));

    return response.json(shop);
  }
}
