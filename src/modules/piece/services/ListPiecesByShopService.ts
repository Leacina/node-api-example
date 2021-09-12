import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IShopsRepository from '@modules/establishment/repositories/IShopsRepository';
import IPiecesRepository from '../repositories/IPiecesRepository';

interface IRequest {
  user_id: number;
  id_loja: number;
  filter?: IFilterRequestList;
}

@injectable()
export default class ListPiecesByShopService {
  constructor(
    @inject('PiecesRepository') private piecesRepository: IPiecesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ShopsRepository')
    private shopsRepository: IShopsRepository,
  ) {}

  public async execute({
    filter,
    id_loja,
    user_id,
  }: IRequest): Promise<IResponseList> {
    const { id_conta } = await this.usersRepository.findById(user_id);
    const { id_estabelecimento } = await this.shopsRepository.findById(id_loja);

    const pieces = await this.piecesRepository.findByShop({
      id_conta,
      id_loja,
      id_estabelecimento,
    });

    return new ListResponse(pieces, filter.page, filter.pageSize);
  }
}
