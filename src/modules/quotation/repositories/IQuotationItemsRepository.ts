import IListDTO from '@modules/piece/dtos/IListDTO';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import QuotationItem from '../infra/typeorm/entities/QuotationItem';
import ICreateQuotationItemDTO from '../dtos/ICreateQuotationItemDTO';
import IProcessQuotationItemsDTO from '../dtos/IProcessQuotationItemsDTO';
import IUpdateValueQuotationItemDTO from '../dtos/IUpdateValueQuotationDTO';

export default interface IQuotationItemsRepository {
  create(data: ICreateQuotationItemDTO[]): Promise<QuotationItem[]>;
  find(
    id_cotacao: number,
    data: IListDTO,
    filter: IFilterRequestList,
  ): Promise<QuotationItem[]>;
  process(dataProcess: IProcessQuotationItemsDTO): Promise<QuotationItem>;
  updateValue(dataValue: IUpdateValueQuotationItemDTO): Promise<QuotationItem>;
  sum(budget_id: number): Promise<number>;
}
