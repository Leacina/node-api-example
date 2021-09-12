import { getRepository, Repository } from 'typeorm';
import IQuotationItemsRepository from '@modules/quotation/repositories/IQuotationItemsRepository';
import IListDTO from '@modules/piece/dtos/IListDTO';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import IProcessQuotationItemsDTO from '@modules/quotation/dtos/IProcessQuotationItemsDTO';
import IUpdateValueQuotationItemDTO from '@modules/quotation/dtos/IUpdateValueQuotationDTO';
import ICreateQuotationItemDTO from '../../../dtos/ICreateQuotationItemDTO';
import QuotationItem from '../entities/QuotationItem';
import Quotation from '../entities/Quotation';

// eslint-disable-next-line no-shadow
enum SituationEnum {
  CANCEL = 'C',
  FULL_SALE = 'VI',
  PARTIAL_SALE = 'VP',
  PENDING = 'P',
}

export default class QuotationItemsRepository
  implements IQuotationItemsRepository {
  private ormRepository: Repository<QuotationItem>;

  private ormRepositoryQuotation: Repository<Quotation>;

  constructor() {
    this.ormRepository = getRepository(QuotationItem);
    this.ormRepositoryQuotation = getRepository(Quotation);
  }

  async create(data: ICreateQuotationItemDTO[]): Promise<QuotationItem[]> {
    const quotationItem = this.ormRepository.create(data);

    await this.ormRepository.save(quotationItem);

    return quotationItem;
  }

  async find(
    id_cotacao: number,
    { id_loja, id_estabelecimento, id_conta }: IListDTO,
    { page, pageSize }: IFilterRequestList,
  ): Promise<QuotationItem[]> {
    const quotationItems = await this.ormRepository.find({
      where: {
        id_cotacao,
      },
      relations: ['cotacao', 'cotacao.loja', 'conta'],
      order: {
        id: 'DESC',
      },
    });

    return quotationItems;
  }

  async process({
    quotation_item_id,
    isConfirm,
  }: IProcessQuotationItemsDTO): Promise<QuotationItem> {
    const quotationItem = await this.ormRepository.findOne({
      where: {
        id: quotation_item_id,
        // id_conta,
      },
    });

    // Altera estado produto
    quotationItem.situacao = isConfirm ? 'Confirmado' : 'Cancelado';

    // Save
    await this.ormRepository.save(quotationItem);

    // Busca para verificar se todos estão cancelados/confirmados/pendentes
    const quotationItems = await this.ormRepository.find({
      where: {
        id_cotacao: quotationItem.id_cotacao,
      },
    });

    // Busca todos os itens cancelados
    const cancel_sale = quotationItems.filter(item => {
      return item.situacao === 'Cancelado';
    });

    // Busca todos os itens pendentes
    const pending = quotationItems.filter(item => {
      return item.situacao === 'Pendente';
    });

    // Busca a cotação para alterar a situação
    const quotation = await this.ormRepositoryQuotation.find({
      where: {
        id: quotationItem.id_cotacao,
      },
    });

    // Se encontrou alguma coisa, então ainda esta parcial... Pois existe items
    // a ser confirmado/cancelado ainda
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < quotation.length; i++) {
      // Somentee muda a situação se não tiver nada pendente
      if (pending.length === 0) {
        // Se todos estiverem cancelados, mostra como cancelado a venda
        if (cancel_sale.length === quotationItems.length) {
          quotation[i].situacao = SituationEnum.CANCEL;
        }
        // Se possuir somente alguns cancelados e nenhum pendente
        // foi uma venda parcial
        else if (cancel_sale.length > 0) {
          quotation[i].situacao = SituationEnum.PARTIAL_SALE;
        }
        // Se for vendido tudo, venda integral
        else {
          quotation[i].situacao = SituationEnum.FULL_SALE;
        }
      } else {
        quotation[i].situacao = SituationEnum.PENDING;
      }
    }

    // Save
    await this.ormRepositoryQuotation.save(quotation);

    return quotationItem;
  }

  async updateValue({
    id,
    value,
  }: IUpdateValueQuotationItemDTO): Promise<QuotationItem> {
    const quotationItem = await this.ormRepository.findOne({
      where: {
        id,
        // id_conta,
      },
    });

    // eslint-disable-next-line no-unused-expressions
    quotationItem as QuotationItem;

    // Altera estado produto
    quotationItem.valor_peca = value;

    // Save
    await this.ormRepository.save(quotationItem);

    return quotationItem;
  }

  async sum(quotation_id: number): Promise<number> {
    const quotationItems = await this.ormRepository.find({
      where: {
        id_cotacao: quotation_id,
      },
    });

    return quotationItems.reduce((acumulador, current_value) => {
      return Number(acumulador) + Number(current_value.valor_peca);
    }, 0);
  }
}
