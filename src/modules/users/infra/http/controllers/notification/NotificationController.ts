import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateNotificationService from '@modules/users/services/notification/CreateNotificationService';
import ListNotificationByIdService from '@modules/users/services/notification/ListNotificationByIdService';
import ListNotificationsService from '@modules/users/services/notification/ListNotificationsService';

export default class NotificationController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createNotificationService = container.resolve(
      CreateNotificationService,
    );
    const notification = await createNotificationService.execute(request.body);

    return response.json(notification);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const listNotificationByIdService = container.resolve(
      ListNotificationByIdService,
    );
    const notifications = await listNotificationByIdService.execute(Number(id));

    return response.json(notifications);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { page, search } = request.query;

    const listNotificationsService = container.resolve(
      ListNotificationsService,
    );

    const notification = await listNotificationsService.execute(
      {
        search: search ? String(search) : '',
        page: Number(page),
        pageSize: 50,
      },
      Number(request.user.id),
    );

    return response.json(notification);
  }
}
