import { Router } from 'express';
import multer from 'multer';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/uploadImageShop';
import ShopController from '../controllers/ShopController';
import ShopByEstablishmentController from '../controllers/ShopByEstablishmentController';
import ImageShopController from '../controllers/ImageShopController';

const shopsRouter = Router();
const upload = multer(uploadConfig);

const shopController = new ShopController();
const shopByEstablishmentController = new ShopByEstablishmentController();
const imageShopController = new ImageShopController();

shopsRouter.use(ensureAuthenticated);

shopsRouter.get('/imagem/:filename', imageShopController.index);
shopsRouter.post(
  '/:id/imagem',
  upload.single('file'),
  imageShopController.create,
);

shopsRouter.get('/:id', shopController.index);
shopsRouter.post('/', shopController.create);
shopsRouter.get('/', shopController.show);
shopsRouter.put('/:id', shopController.update);
shopsRouter.get('/estabelecimento/:id', shopByEstablishmentController.show);

export default shopsRouter;
