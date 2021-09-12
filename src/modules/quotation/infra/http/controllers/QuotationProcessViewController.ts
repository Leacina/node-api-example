import { container } from 'tsyringe';
import { Request, Response } from 'express';

import UpdateQuotationViewClienteService from '@modules/quotation/services/UpdateQuotationViewClienteService';

export default class QuotationsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { view, id } = request.params;
    const updateQuotationViewClienteService = container.resolve(
      UpdateQuotationViewClienteService,
    );

    const quotations = await updateQuotationViewClienteService.execute({
      quotation_id: Number(id),
      isView: Number(view),
    });
    return response.json(quotations);
  }
}
