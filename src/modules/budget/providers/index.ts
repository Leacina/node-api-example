/**
 * Injeção de dependências
 */
import { container } from 'tsyringe';

import IBudgetItemsRepository from '../repositories/IBudgetItemsRepository';
import BudgetItemsRepository from '../infra/typeorm/repositories/BudgetItemsRepository';

import IBudgetsRepository from '../repositories/IBudgetsRepository';
import BudgetsRepository from '../infra/typeorm/repositories/BudgetsRepository';

container.registerSingleton<IBudgetItemsRepository>(
  'BudgetItemsRepository',
  BudgetItemsRepository,
);

container.registerSingleton<IBudgetsRepository>(
  'BudgetsRepository',
  BudgetsRepository,
);
