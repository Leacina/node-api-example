import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import BudgetsController from '../controllers/BudgetController';
import BudgetByEmailController from '../controllers/BudgetByEmailController';
import BudgetConfirmController from '../controllers/BudgetConfirmController';
import BudgetCancelController from '../controllers/BudgetCancelController';
import budgetItemsRouter from './budgetItems.routes';

const budgetsRouter = Router();
const budgetsController = new BudgetsController();
const budgetByEmailController = new BudgetByEmailController();
const budgetConfirmController = new BudgetConfirmController();
const budgetCancelController = new BudgetCancelController();

budgetsRouter.use(ensureAuthenticated);
budgetsRouter.use('/', budgetItemsRouter);
budgetsRouter.post('/', budgetsController.create);
budgetsRouter.get('/', budgetsController.show);
budgetsRouter.get('/:id', budgetsController.index);
budgetsRouter.get('/email/:email', budgetByEmailController.index);
budgetsRouter.put('/confirmar/:id', budgetConfirmController.update);
budgetsRouter.put('/cancelar/:id', budgetCancelController.update);

export default budgetsRouter;
