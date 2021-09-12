import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteNotificationByBudgetService from '@modules/users/services/notification/DeleteNotificationByBudgetService';

export default class NotificationBudgetController {
  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteNotificationByBudgetService = container.resolve(
      DeleteNotificationByBudgetService,
    );

    deleteNotificationByBudgetService.execute(Number(id));

    return response.json({ ok: true });
  }
}
