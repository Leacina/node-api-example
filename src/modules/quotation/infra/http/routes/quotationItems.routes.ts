import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import QuotationItemController from '../controllers/QuotationItemController';
import QuotationItemConfirmController from '../controllers/QuotationItemConfirmController';
import QuotationItemCancelController from '../controllers/QuotationItemCancelController';

const quotationItemsRouter = Router();

const quotationItemController = new QuotationItemController();
const quotationItemConfirmController = new QuotationItemConfirmController();
const quotationItemCancelController = new QuotationItemCancelController();

quotationItemsRouter.use(ensureAuthenticated);
quotationItemsRouter.get('/:id/itens', quotationItemController.index);
quotationItemsRouter.put('/itens/:id', quotationItemController.update);
quotationItemsRouter.put(
  '/itens/confirmar/:id',
  quotationItemConfirmController.update,
);
quotationItemsRouter.put(
  '/itens/cancelar/:id',
  quotationItemCancelController.update,
);

export default quotationItemsRouter;
