import { injectable, inject } from 'tsyringe';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IEstablishmentsRepository from '../repositories/IEstablishmentsRepository';

@injectable()
class ListEstablishmentService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param establishmentsRepository
   */
  constructor(
    @inject('EstablishmentsRepository')
    private establishmentsRepository: IEstablishmentsRepository,
  ) {}

  public async execute(
    filter?: IFilterRequestList,
  ): Promise<IResponseList | undefined> {
    const establishment = await this.establishmentsRepository.find(filter);

    return new ListResponse(establishment, filter.page, filter.pageSize);
  }
}

export default ListEstablishmentService;
