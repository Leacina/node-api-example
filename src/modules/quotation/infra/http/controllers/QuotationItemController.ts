import { container } from 'tsyringe';
import { Request, Response } from 'express';

// import CreateBudgetService from '@modules/budget/services/CreateBudgetService';
import ListItemsQuotationByIdentifierService from '@modules/quotation/services/ListItemsQuotationByIdentifierService';
import UpdateValueItemQuotationService from '@modules/quotation/services/UpdateValueItemQuotationService';

export default class QuotationItemsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { page, pageSize } = request.query;
    const listItemsQuotationByIdentifierService = container.resolve(
      ListItemsQuotationByIdentifierService,
    );

    const brands = await listItemsQuotationByIdentifierService.execute(
      Number(id),
      Number(request.user.id),
      {
        page: Number(page),
        pageSize: Number(pageSize),
      },
    );

    return response.json(brands);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { valor_peca } = request.body;

    const updateValueItemQuotationService = container.resolve(
      UpdateValueItemQuotationService,
    );

    const quotations = await updateValueItemQuotationService.execute({
      id: Number(id),
      value: valor_peca,
    });
    return response.json(quotations);
  }
}
