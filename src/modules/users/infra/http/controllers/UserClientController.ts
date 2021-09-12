import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUsersService from '@modules/users/services/ListUsersLogistOrClientService';

export default class UserController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { page, pageSize, search } = request.query;

    const listUsersService = container.resolve(ListUsersService);
    const user = await listUsersService.execute(false, {
      search: search ? String(search) : '',
      page: Number(page),
      pageSize: Number(pageSize),
    });

    return response.json(user);
  }
}
