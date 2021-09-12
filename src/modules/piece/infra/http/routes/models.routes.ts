import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ModelsController from '../controllers/ModelsController';
import ModelsByBrandController from '../controllers/ModelsByBrandController';

const modelsRouter = Router();
const modelsController = new ModelsController();
const modelsByBrandController = new ModelsByBrandController();

modelsRouter.use(ensureAuthenticated);
modelsRouter.get('/marca/:id', modelsByBrandController.show);
modelsRouter.post('/', modelsController.create);
modelsRouter.get('/', modelsController.show);
modelsRouter.get('/:id', modelsController.index);
modelsRouter.put('/:id', modelsController.update);
modelsRouter.delete('/:id', modelsController.delete);

export default modelsRouter;
