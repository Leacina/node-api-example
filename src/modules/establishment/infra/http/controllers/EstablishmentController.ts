import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListEstablishmentByIDService from '@modules/establishment/services/ListEstablishmentByIDService';
import ListEstablishmentService from '@modules/establishment/services/ListEstablishmentService';
import CreateEstablishmentService from '@modules/establishment/services/CreateEstablishmentService';
import UpdateEstablishmentService from '@modules/establishment/services/UpdateEstablishmentService';

export default class AppointmentController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const listEstablishment = container.resolve(ListEstablishmentByIDService);
    const establishments = await listEstablishment.execute(Number(id));

    return response.json(establishments);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { page, pageSize, search } = request.query;
    const listEstablishmentService = container.resolve(
      ListEstablishmentService,
    );

    const establishments = await listEstablishmentService.execute({
      search: search ? String(search) : '',
      page: Number(page),
      pageSize: Number(pageSize),
    });

    return response.json(establishments);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      cnpj_cpf,
      razao_social,
      nm_estabelecimento,
      responsavel,
      telefone_responsavel,
      cidade,
      estado,
      quantidade_lojas,
    } = request.body;

    const createEstablishment = container.resolve(CreateEstablishmentService);

    const establishment = await createEstablishment.execute(
      {
        cnpj_cpf,
        razao_social,
        nm_estabelecimento,
        responsavel,
        telefone_responsavel,
        cidade,
        estado,
        quantidade_lojas,
      },
      Number(request.user.id),
    );

    return response.json(establishment);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const {
      cnpj_cpf,
      razao_social,
      nm_estabelecimento,
      responsavel,
      telefone_responsavel,
      cidade,
      estado,
      quantidade_lojas,
    } = request.body;

    const updateEstablishmentService = container.resolve(
      UpdateEstablishmentService,
    );

    const establishment = await updateEstablishmentService.execute(
      Number(id),
      {
        cnpj_cpf,
        razao_social,
        nm_estabelecimento,
        responsavel,
        telefone_responsavel,
        cidade,
        estado,
        quantidade_lojas,
      },
      Number(request.user.id),
    );

    return response.json(establishment);
  }
}
