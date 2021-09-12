import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IQuotationsRepository from '../repositories/IQuotationsRepository';
import Quotation from '../infra/typeorm/entities/Quotation';

interface IRequest {
  quotation_id: number;
  isView: number;
}

@injectable()
export default class UpdateQuotationItemProcessService {
  constructor(
    @inject('QuotationsRepository')
    private quotationsRepository: IQuotationsRepository,
  ) {}

  public async execute({ quotation_id, isView }: IRequest): Promise<Quotation> {
    // Verifica se a cotação foi finalizada
    const quotation = await this.quotationsRepository.findById(
      Number(quotation_id),
    );

    if (!quotation) {
      throw new AppError('Cotação não encontrada', 400);
    }

    const quotationModel = await this.quotationsRepository.processView(
      quotation_id,
      isView,
    );

    return quotationModel;
  }
}
