import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CreateCategoryService from '@modules/piece/services/category/CreateCategoryService';
import DeleteCategoryService from '@modules/piece/services/category/DeleteCategoryService';
import ListCategoryByIDService from '@modules/piece/services/category/ListCategoryByIDService';
import ListCategoriesService from '@modules/piece/services/category/ListCategoriesService';
import UpdateCategoryService from '@modules/piece/services/category/UpdateCategoryService';

export default class CategoriesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { categoria } = request.body;
    const createCategories = container.resolve(CreateCategoryService);

    const category = await createCategories.execute({
      category: categoria,
      user_id: Number(request.user.id),
    });

    return response.json(category);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const listCategoryById = container.resolve(ListCategoryByIDService);

    const category = await listCategoryById.execute({
      id_category: Number(id),
      user_id: Number(request.user.id),
    });

    return response.json(category);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { page, pageSize, ignorePage } = request.query;
    const listCategory = container.resolve(ListCategoriesService);

    const categories = await listCategory.execute(Number(request.user.id), {
      ignorePage: ignorePage === 'true',
      page: Number(page),
      pageSize: Number(pageSize),
    });

    return response.json(categories);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deleteCategory = container.resolve(DeleteCategoryService);

    await deleteCategory.execute({
      id: Number(id),
      user_id: Number(request.user.id),
    });

    return response.status(200).send();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { categoria } = request.body;
    const updateCategory = container.resolve(UpdateCategoryService);

    const category = await updateCategory.execute({
      category: categoria,
      category_id: Number(id),
      user_id: Number(request.user.id),
    });

    return response.json(category);
  }
}
