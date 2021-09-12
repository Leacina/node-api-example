import { container } from 'tsyringe';
import { Request, Response } from 'express';

// import CreateBudgetService from '@modules/budget/services/CreateBudgetService';
import ListItemsByBudget from '@modules/budget/services/ListItemsByBudget';

export default class BudgetsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { page, pageSize } = request.query;
    const listBudgetsItems = container.resolve(ListItemsByBudget);

    const brands = await listBudgetsItems.execute(
      Number(id),
      Number(request.user.id),
      {
        page: Number(page),
        pageSize: Number(pageSize),
      },
    );

    return response.json(brands);
  }
}
