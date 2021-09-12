import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import BudgetItemController from '../controllers/BudgetItemController';
import BudgetItemConfirmController from '../controllers/BudgetItemConfirmController';
import BudgetItemCancelController from '../controllers/BudgetItemCancelController';

const budgetItemsRouter = Router();
const budgetsItemsController = new BudgetItemController();
const budgetItemConfirmController = new BudgetItemConfirmController();
const budgetItemCancelController = new BudgetItemCancelController();

budgetItemsRouter.use(ensureAuthenticated);
budgetItemsRouter.get('/:id/itens', budgetsItemsController.index);
budgetItemsRouter.put(
  '/itens/confirmar/:id',
  budgetItemConfirmController.update,
);
budgetItemsRouter.put('/itens/cancelar/:id', budgetItemCancelController.update);

export default budgetItemsRouter;
