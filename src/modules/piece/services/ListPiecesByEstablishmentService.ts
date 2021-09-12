import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IPiecesRepository from '../repositories/IPiecesRepository';

interface IRequest {
  user_id: number;
  id_estabelecimento: number;
  filter?: IFilterRequestList;
}

@injectable()
export default class ListPiecesByEstablishmentService {
  constructor(
    @inject('PiecesRepository') private piecesRepository: IPiecesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    filter,
    id_estabelecimento,
  }: IRequest): Promise<IResponseList> {
    const { id_conta } = await this.usersRepository.findById(user_id);

    const pieces = await this.piecesRepository.find(
      {
        id_conta,
        id_estabelecimento,
      },
      filter,
    );

    return new ListResponse(pieces, filter.page, filter.pageSize);
  }
}
