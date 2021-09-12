import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ActivateOrDisableUserService from '@modules/users/services/ActivateOrDisableUserService';

export default class UserActivateController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const activateOrDisableUserService = container.resolve(
      ActivateOrDisableUserService,
    );
    const user = await activateOrDisableUserService.execute(Number(id), true);

    return response.json(user);
  }
}
