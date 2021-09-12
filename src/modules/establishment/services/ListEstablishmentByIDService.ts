import { injectable, inject } from 'tsyringe';
import Establishment from '../infra/typeorm/entities/Establishment';
import IEstablishmentsRepository from '../repositories/IEstablishmentsRepository';

@injectable()
class ListEstablishmentByIDService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param establishmentsRepository
   */
  constructor(
    @inject('EstablishmentsRepository')
    private establishmentsRepository: IEstablishmentsRepository,
  ) {}

  public async execute(id: number): Promise<Establishment | undefined> {
    const establishment = await this.establishmentsRepository.findById(id);

    return establishment;
  }
}

export default ListEstablishmentByIDService;
