import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListBudgetsService from '@modules/budget/services/ListBugetsService';
import ListBudgetByIdService from '@modules/budget/services/ListBudgetByIdService';
import CreateBudgetService from '@modules/budget/services/CreateBudgetService';

export default class BudgetsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { items, emitente, emitente_email, emitente_telefone } = request.body;
    const createBudgetService = container.resolve(CreateBudgetService);

    const brands = await createBudgetService.execute(
      Number(request.user.id),
      { emitente, emitente_email, emitente_telefone },
      items,
    );
    return response.json(brands);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { page, pageSize, search } = request.query;

    const listBudgets = container.resolve(ListBudgetsService);

    const brands = await listBudgets.execute(Number(request.user.id), {
      search: search ? String(search) : '',
      page: Number(page),
      pageSize: Number(pageSize),
    });
    return response.json(brands);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const listBudgetByIdService = container.resolve(ListBudgetByIdService);

    const brands = await listBudgetByIdService.execute(
      Number(id),
      Number(request.user.id),
    );
    return response.json(brands);
  }
}
