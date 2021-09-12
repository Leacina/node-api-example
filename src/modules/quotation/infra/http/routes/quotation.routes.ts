import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import QuotationController from '../controllers/QuotationController';
import QuotationByEmailController from '../controllers/QuotationByEmailController';
import QuotationProcessViewController from '../controllers/QuotationProcessViewController';
import budgetItemsRouter from './quotationItems.routes';

const quotationsRouter = Router();

const quotationController = new QuotationController();
const quotationByEmailController = new QuotationByEmailController();
const quotationProcessViewController = new QuotationProcessViewController();

quotationsRouter.use(ensureAuthenticated);
quotationsRouter.use('/', budgetItemsRouter);
quotationsRouter.post('/', quotationController.create);
quotationsRouter.get('/', quotationController.show);
quotationsRouter.get('/email/:email', quotationByEmailController.show);
quotationsRouter.put(
  '/visualizado/:id/:view',
  quotationProcessViewController.create,
);

export default quotationsRouter;
