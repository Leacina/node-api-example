import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListBudgetsByEmailService from '@modules/budget/services/ListBudgetsByEmailService';

export default class BudgetsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { email } = request.params;
    const { page, pageSize } = request.query;

    const listBudgets = container.resolve(ListBudgetsByEmailService);

    const brands = await listBudgets.execute(email, Number(request.user.id), {
      page: Number(page),
      pageSize: Number(pageSize),
    });
    return response.json(brands);
  }
}
