import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import BrandsController from '../controllers/BrandsController';

const brandsRouter = Router();
const brandsController = new BrandsController();

brandsRouter.use(ensureAuthenticated);
brandsRouter.post('/', brandsController.create);
brandsRouter.get('/', brandsController.show);
brandsRouter.get('/:id', brandsController.index);
brandsRouter.put('/:id', brandsController.update);
brandsRouter.delete('/:id', brandsController.delete);

export default brandsRouter;
