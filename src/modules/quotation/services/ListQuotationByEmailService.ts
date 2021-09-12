/* eslint-disable no-param-reassign */
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import IResponseList from '@shared/utils/dtos/IResponseList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IQuotationsRepository from '../repositories/IQuotationsRepository';
// import Quotation from '../infra/typeorm/entities/Quotation';
import IQuotationItemsRepository from '../repositories/IQuotationItemsRepository';

@injectable()
export default class ListBudgetsByEmailService {
  constructor(
    @inject('QuotationsRepository')
    private quotationsRepository: IQuotationsRepository,

    @inject('QuotationItemsRepository')
    private quotationItemsRepository: IQuotationItemsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    budget_email: string,
    user_id: number,
    filter?: IFilterRequestList,
    isViewAll?: number,
  ): Promise<IResponseList> {
    const {
      id_conta,
      id_estabelecimento,
      id_loja,
    } = await this.usersRepository.findById(user_id);

    const quotations = await this.quotationsRepository.findByEmail(
      budget_email,
      {
        id_conta,
        id_estabelecimento,
        id_loja,
      },
      filter,
      isViewAll,
    );

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < quotations.length; i++) {
      if (quotations[i].situacao === 'P') {
        quotations[i].situacao = 'Pendente';
      } else if (quotations[i].situacao === 'VP') {
        quotations[i].situacao = 'Venda Parcial';
      } else if (quotations[i].situacao === 'VI') {
        quotations[i].situacao = 'Venda Integral';
      } else if (quotations[i].situacao === 'C') {
        quotations[i].situacao = 'Cancelado';
      }

      // eslint-disable-next-line no-await-in-loop
      quotations[i].valor_total = await this.quotationItemsRepository.sum(
        quotations[i].id,
      );
    }

    return new ListResponse(quotations, filter.page, filter.pageSize);
    // return quotations;
  }
}
