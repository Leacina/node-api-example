import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IQuotationItemsRepository from '../repositories/IQuotationItemsRepository';

@injectable()
export default class ListItemsQuotationByIndetifierService {
  constructor(
    @inject('QuotationItemsRepository')
    private quotationItemsRepository: IQuotationItemsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    id_cotacao: number,
    user_id: number,
    filter?: IFilterRequestList,
  ): Promise<IResponseList> {
    const {
      id_conta,
      id_estabelecimento,
      id_loja,
    } = await this.usersRepository.findById(user_id);

    const quotationItems = await this.quotationItemsRepository.find(
      id_cotacao,
      {
        id_conta,
        id_estabelecimento,
        id_loja,
      },
      filter,
    );

    return new ListResponse(quotationItems, filter.page, filter.pageSize);
  }
}
