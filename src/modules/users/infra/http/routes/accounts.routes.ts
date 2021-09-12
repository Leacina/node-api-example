import { Router } from 'express';

import AccountsController from '../controllers/AccountController';

const accountsRouter = Router();

const accountsController = new AccountsController();

accountsRouter.post('/', accountsController.create);
accountsRouter.get('/:id', accountsController.index);

export default accountsRouter;
