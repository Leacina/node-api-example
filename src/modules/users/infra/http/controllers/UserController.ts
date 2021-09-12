import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import ListUsersService from '@modules/users/services/ListUsersLogistOrClientService';
import ListUserByIdService from '@modules/users/services/ListUserByIdService';
import UpdateUserService from '@modules/users/services/UpdateUserService';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute(request.body);

    delete user.ds_senha;

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const updateUserService = container.resolve(UpdateUserService);
    const user = await updateUserService.execute(Number(id), request.body);

    delete user.ds_senha;

    return response.json(user);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { page, pageSize, search } = request.query;
    const listUsersService = container.resolve(ListUsersService);

    const user = await listUsersService.execute(true, {
      search: search ? String(search) : '',
      page: Number(page),
      pageSize: Number(pageSize),
    });

    return response.json(user);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const listUserByIdService = container.resolve(ListUserByIdService);
    const user = await listUserByIdService.execute(Number(id));

    return response.json(user);
  }
}
