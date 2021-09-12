/* eslint-disable no-param-reassign */
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IQuotationsRepository from '../repositories/IQuotationsRepository';
import IQuotationItemsRepository from '../repositories/IQuotationItemsRepository';

@injectable()
export default class ListQuotationsService {
  constructor(
    @inject('QuotationsRepository')
    private quotationsRepository: IQuotationsRepository,

    @inject('QuotationItemsRepository')
    private quotationItemsRepository: IQuotationItemsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    user_id: number,
    filter?: IFilterRequestList,
  ): Promise<IResponseList> {
    const {
      id_conta,
      id_estabelecimento,
      id_loja,
    } = await this.usersRepository.findById(user_id);

    const quotations = await this.quotationsRepository.find(
      {
        id_conta,
        id_estabelecimento,
        id_loja,
      },
      filter,
    );

    quotations.map(quotation => {
      if (quotation.situacao === 'P') {
        quotation.situacao = 'Pendente';
      } else if (quotation.situacao === 'VP') {
        quotation.situacao = 'Venda Parcial';
      } else if (quotation.situacao === 'VI') {
        quotation.situacao = 'Venda Integral';
      } else if (quotation.situacao === 'C') {
        quotation.situacao = 'Cancelado';
      }

      return quotation;
    });

    return new ListResponse(quotations, filter.page, filter.pageSize);
  }
}
