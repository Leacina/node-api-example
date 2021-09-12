import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DeleteNotificationByQuotationService from '@modules/users/services/notification/DeleteNotificationByQuotationService';

export default class NotificationQuotationController {
  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteNotificationByQuotationService = container.resolve(
      DeleteNotificationByQuotationService,
    );

    deleteNotificationByQuotationService.execute(Number(id));

    return response.json({ ok: true });
  }
}
