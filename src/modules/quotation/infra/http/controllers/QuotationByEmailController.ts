import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListQuotationByEmailService from '@modules/quotation/services/ListQuotationByEmailService';

export default class QuotationByEmailController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { email } = request.params;
    const { page, pageSize, search, isViewAll } = request.query;

    const listQuotations = container.resolve(ListQuotationByEmailService);

    const quotations = await listQuotations.execute(
      email,
      Number(request.user.id),
      {
        search: search ? String(search) : '',
        page: Number(page),
        pageSize: Number(pageSize),
      },
      Number(isViewAll),
    );
    return response.json(quotations);
  }
}
