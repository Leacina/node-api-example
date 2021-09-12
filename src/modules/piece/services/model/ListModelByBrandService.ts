import { inject, injectable } from 'tsyringe';
import IResponseList from '@shared/utils/dtos/IResponseList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IModelsRepository from '../../repositories/IModelsRepository';

@injectable()
export default class ListModelService {
  constructor(
    @inject('ModelsRepository') private modelsRepository: IModelsRepository,
  ) {}

  public async execute(id_marca: number): Promise<IResponseList> {
    const models = await this.modelsRepository.findByBrand(id_marca);

    return new ListResponse(models, 0, 0);
  }
}
