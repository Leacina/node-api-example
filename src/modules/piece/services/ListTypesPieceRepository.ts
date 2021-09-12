import { inject, injectable } from 'tsyringe';
import IResponseList from '@shared/utils/dtos/IResponseList';
import IFilterRequestList from '@shared/utils/dtos/IFilterRequestList';
import ListResponse from '@shared/utils/implementations/AppListResponse';
import ITypesPieceRepository from '../repositories/ITypesPieceRepository';

@injectable()
export default class ListTypesPiecesService {
  constructor(
    @inject('TypesPieceRepository')
    private typesPieceRepository: ITypesPieceRepository,
  ) {}

  public async execute(filter?: IFilterRequestList): Promise<IResponseList> {
    const pieces = await this.typesPieceRepository.find();

    return new ListResponse(
      pieces,
      filter.page,
      filter.pageSize,
      filter.ignorePage,
    );
  }
}
