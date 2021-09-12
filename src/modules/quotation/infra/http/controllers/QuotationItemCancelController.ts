import { container } from 'tsyringe';
import { Request, Response } from 'express';

import UpdateQuotationItemProcessService from '@modules/quotation/services/UpdateQuotationItemProcessService';

export default class QuotationItemCancelController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const updateQuotationItemProcessService = container.resolve(
      UpdateQuotationItemProcessService,
    );

    const quotations = await updateQuotationItemProcessService.execute({
      quotation_item_id: Number(id),
      isConfirm: false,
    });
    return response.json(quotations);
  }
}
