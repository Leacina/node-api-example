/**
 * Injeção de dependências
 */
import { container } from 'tsyringe';

import IUsersRepository from '../repositories/IUserRepository';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';

import IUserLegalInfoService from '../repositories/IUserLegalInfoRepository';
import UserLegalInfoRepository from '../infra/typeorm/repositories/UserLegalInfoRepository';

import IAccountsRepository from '../repositories/IAccountsRepository';
import AccountsRepository from '../infra/typeorm/repositories/AccountsRepository';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

import IPerfilRepository from '../repositories/IPerfilRepository';
import PerfilRepository from '../infra/typeorm/repositories/PerfilRepository';

import IUserTokensRepository from '../repositories/IUserTokensRepository';
import UserTokensRepository from '../infra/typeorm/repositories/UserTokensRepository';

import INotificationsRepository from '../repositories/INotificationsRepository';
import NotificationsRepository from '../infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);

container.registerSingleton<IUserLegalInfoService>(
  'UserLegalInfoRepository',
  UserLegalInfoRepository,
);

container.registerSingleton<IAccountsRepository>(
  'AccountsRepository',
  AccountsRepository,
);

container.registerSingleton<IPerfilRepository>(
  'PerfilRepository',
  PerfilRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);
