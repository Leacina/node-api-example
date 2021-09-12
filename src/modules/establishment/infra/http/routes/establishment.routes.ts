import { Router } from 'express';

import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import EstablishmentsController from '../controllers/EstablishmentController';
import EstablishmentsAccountController from '../controllers/EstablishmentByAccountController';

const establishmentsRouter = Router();

const establishmentsController = new EstablishmentsController();
const establishmentsAccountController = new EstablishmentsAccountController();

establishmentsRouter.use(ensureAuthenticate);

establishmentsRouter.get('/:id', establishmentsController.index);
establishmentsRouter.post('/', establishmentsController.create);
establishmentsRouter.get('/', establishmentsController.show);
establishmentsRouter.put('/:id', establishmentsController.update);
establishmentsRouter.get('/conta/:id', establishmentsAccountController.show);

export default establishmentsRouter;
