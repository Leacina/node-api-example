import { Router } from 'express';

import PerfilController from '../controllers/PerfilController';

const perfilRouter = Router();

const perfilController = new PerfilController();

perfilRouter.post('/', perfilController.create);
perfilRouter.get('/', perfilController.show);
perfilRouter.get('/:id', perfilController.index);
perfilRouter.put('/:id', perfilController.update);

export default perfilRouter;
