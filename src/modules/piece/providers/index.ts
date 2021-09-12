/**
 * Injeção de dependências
 */
import { container } from 'tsyringe';

import IBrandsRepository from '../repositories/IBrandsRepository';
import BrandsRepository from '../infra/typeorm/repositories/BrandsRepository';

import IModelsRepository from '../repositories/IModelsRepository';
import ModelsRepository from '../infra/typeorm/repositories/ModelsRepository';

import ICategoriesRepository from '../repositories/ICategoriesRepository';
import CategoriesRepository from '../infra/typeorm/repositories/CategoriesRepository';

import IPiecesRepository from '../repositories/IPiecesRepository';
import PiecesRepository from '../infra/typeorm/repositories/PiecesRepository';

import IImagePieceRepository from '../repositories/IImagePieceRepository';
import ImagePieceRepository from '../infra/typeorm/repositories/ImagePieceRepository';

import ITypesPieceRepository from '../repositories/ITypesPieceRepository';
import TypesPieceRepository from '../infra/typeorm/repositories/TypesPieceRepository';

container.registerSingleton<IImagePieceRepository>(
  'ImagePieceRepository',
  ImagePieceRepository,
);

container.registerSingleton<IBrandsRepository>(
  'BrandsRepository',
  BrandsRepository,
);

container.registerSingleton<IModelsRepository>(
  'ModelsRepository',
  ModelsRepository,
);

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository,
);

container.registerSingleton<IPiecesRepository>(
  'PiecesRepository',
  PiecesRepository,
);

container.registerSingleton<ITypesPieceRepository>(
  'TypesPieceRepository',
  TypesPieceRepository,
);
