import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAccountService from '@modules/users/services/account/CreateAccountService';
import ListAccountByIDService from '@modules/users/services/account/ListAccountByIDService';

export default class AccountController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createAccount = container.resolve(CreateAccountService);
    const account = await createAccount.execute(request.body);

    return response.json(account);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const listAccountByID = container.resolve(ListAccountByIDService);
    const account = await listAccountByID.execute(Number(id));

    return response.json(account);
  }
}
