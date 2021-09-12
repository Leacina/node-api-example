import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListQuotationsService from '@modules/quotation/services/ListQuotationsService';
import CreateQuotationService from '@modules/quotation/services/CreateQuotationService';

export default class QuotationsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      items,
      emitente,
      emitente_email,
      emitente_telefone,
      identificador_cotacao,
      cidades,
      lojas,
    } = request.body;
    const createQuotationService = container.resolve(CreateQuotationService);

    const quotations = await createQuotationService.execute(
      Number(request.user.id),
      {
        emitente,
        emitente_email,
        emitente_telefone,
        identificador_cotacao,
        cidades,
        lojas,
      },
      items,
    );
    return response.json(quotations);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { page, pageSize, search } = request.query;

    const listQuotationsService = container.resolve(ListQuotationsService);

    const quotations = await listQuotationsService.execute(
      Number(request.user.id),
      {
        search: search ? String(search) : '',
        page: Number(page),
        pageSize: Number(pageSize),
      },
    );
    return response.json(quotations);
  }
}
