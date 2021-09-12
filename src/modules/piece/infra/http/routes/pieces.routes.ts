import { Router } from 'express';
import multer from 'multer';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/uploadImagePiece';
import PiecesController from '../controllers/PiecesController';
import PieceUnionFilterController from '../controllers/PieceUnionFilterController';
import PiecesSpotlightController from '../controllers/PiecesSpotlightController';
import PiecesByEstablishmentController from '../controllers/PiecesByEstablishmentController';
import PiecesByShopController from '../controllers/PiecesByShopController';
import PiecesByCategoryController from '../controllers/PiecesByCategoryController';
import ImagePieceController from '../controllers/ImagePieceController';
import TypesPieceController from '../controllers/TypesPieceController';

const upload = multer(uploadConfig);
const piecesRouter = Router();
const piecesController = new PiecesController();
const piecesByEstablishmentController = new PiecesByEstablishmentController();
const piecesByShopController = new PiecesByShopController();
const piecesByCategoryController = new PiecesByCategoryController();
const imagePieceController = new ImagePieceController();
const piecesSpotlightController = new PiecesSpotlightController();
const typesPieceController = new TypesPieceController();
const pieceUnionFilterController = new PieceUnionFilterController();

piecesRouter.get('/imagem/:filename', imagePieceController.index);

piecesRouter.use(ensureAuthenticated);

piecesRouter.post('/:id/imagens', upload.any(), imagePieceController.create);
piecesRouter.get('/:id/imagens', imagePieceController.show);

piecesRouter.get('/tipos', typesPieceController.index);
piecesRouter.get('/destaque', piecesSpotlightController.show);
piecesRouter.put(
  '/destaque/:id/:peca_destaque',
  piecesSpotlightController.update,
);

piecesRouter.post('/', piecesController.create);
piecesRouter.put('/:id', piecesController.update);
piecesRouter.get('/', piecesController.show);
piecesRouter.get('/union', pieceUnionFilterController.show);
piecesRouter.get('/:id', piecesController.index);
piecesRouter.delete('/:id', piecesController.delete);
piecesRouter.get('/estabelecimento/:id', piecesByEstablishmentController.show);
piecesRouter.get('/estabelecimento/loja/:id', piecesByShopController.show);
piecesRouter.get('/categoria/:id', piecesByCategoryController.show);
piecesRouter.get(
  '/categoria/todas/:id/:cidade',
  piecesByCategoryController.show,
);
piecesRouter.get(
  '/categoria/todas/:id/:cidade',
  piecesByCategoryController.show,
);

export default piecesRouter;
