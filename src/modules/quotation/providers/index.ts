/**
 * Injeção de dependências
 */
import { container } from 'tsyringe';

import IQuotationItemsRepository from '../repositories/IQuotationItemsRepository';
import QuotationItemsRepository from '../infra/typeorm/repositories/QuotationItemsRepository';

import IQuotationsRepository from '../repositories/IQuotationsRepository';
import QuotationsRepository from '../infra/typeorm/repositories/QuotationsRepository';

container.registerSingleton<IQuotationItemsRepository>(
  'QuotationItemsRepository',
  QuotationItemsRepository,
);

container.registerSingleton<IQuotationsRepository>(
  'QuotationsRepository',
  QuotationsRepository,
);
