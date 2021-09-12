import { inject, injectable } from 'tsyringe';
import IResponseList from '@shared/utils/dtos/IResponseList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import IPerfilRepository from '../../repositories/IPerfilRepository';

@injectable()
export default class ListPerfilService {
  constructor(
    @inject('PerfilRepository')
    private perfilRepository: IPerfilRepository,
  ) {}

  public async execute(
    filter?: IFilterRequestList,
  ): Promise<IResponseList | undefined> {
    const perfil = await this.perfilRepository.find(filter);
    return new ListResponse(perfil, filter.page, filter.pageSize);
  }
}
