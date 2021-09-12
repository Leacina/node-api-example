import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CheckViewedUserService from '@modules/users/services/notification/CheckViewedUserService';

export default class NotificationController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const checkViewedUserService = container.resolve(CheckViewedUserService);
    const notifications = await checkViewedUserService.execute(Number(id));

    return response.json(notifications);
  }
}
