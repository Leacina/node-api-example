import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserLegalInfoService';

export default class UserLegalInfoController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({ ...request.body });

    return response.json(user);
  }
}
