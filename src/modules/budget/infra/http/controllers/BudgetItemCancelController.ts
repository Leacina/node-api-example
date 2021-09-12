import { container } from 'tsyringe';
import { Request, Response } from 'express';

import UpdateBudgetItemProcessService from '@modules/budget/services/UpdateBudgetItemProcessService';

export default class BudgetItemCancelController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const updateBudgetItemProcessService = container.resolve(
      UpdateBudgetItemProcessService,
    );

    const budgets = await updateBudgetItemProcessService.execute({
      budget_item_id: Number(id),
      isConfirm: false,
    });
    return response.json(budgets);
  }
}
