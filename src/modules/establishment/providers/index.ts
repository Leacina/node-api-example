/**
 * Injeção de dependências
 */

import { container } from 'tsyringe';

import IEstablishmentsRepository from '../repositories/IEstablishmentsRepository';
import EstablishmentsRepository from '../infra/typeorm/repositories/EstablishmentsRepository';

import IShopsRepository from '../repositories/IShopsRepository';
import ShopsRepository from '../infra/typeorm/repositories/ShopsRepository';

container.registerSingleton<IEstablishmentsRepository>(
  'EstablishmentsRepository',
  EstablishmentsRepository,
);

container.registerSingleton<IShopsRepository>(
  'ShopsRepository',
  ShopsRepository,
);
