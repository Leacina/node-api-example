import { container } from 'tsyringe';
import { Request, Response } from 'express';

// import CreateBudgetService from '@modules/budget/services/CreateBudgetService';
import UpdateBudgetProcessService from '@modules/budget/services/UpdateBudgetProcessService';

export default class BudgetCancelController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const updateBudgetProcessService = container.resolve(
      UpdateBudgetProcessService,
    );

    const brands = await updateBudgetProcessService.execute(
      {
        budget_id: Number(id),
        isConfirm: false,
      },
      Number(3),
    );
    return response.json(brands);
  }
}
