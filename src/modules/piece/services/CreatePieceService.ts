/* eslint-disable no-param-reassign */
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import AppError from '@shared/errors/AppError';
import * as yup from 'yup';
import IShopsRepository from '@modules/establishment/repositories/IShopsRepository';
import IEstablishmentsRepository from '@modules/establishment/repositories/IEstablishmentsRepository';
import IBrandsRepository from '../repositories/IBrandsRepository';
import IModelsRepository from '../repositories/IModelsRepository';
import IPiecesRepository from '../repositories/IPiecesRepository';
import Piece from '../infra/typeorm/entities/Piece';
import IImagePieceRepository from '../repositories/IImagePieceRepository';

interface IRequest {
  id_estabelecimento: number;
  id_loja: number;
  id_marca: number;
  id_modelo: number;
  id_categoria: number;
  nm_peca: string;
  valor_peca: number;
  valor_peca_oficina: number;
  valor_peca_seguradora: number;
  peca_destaque?: number;
  qt_disponivel: number;
  qt_estoque: number;
  ano_inicial: number;
  codigo_peca: string;
  is_promocional: string;
  altura?: number;
  largura?: number;
  comprimento?: number;
  peso_bruto?: number;
  cor?: string;
  condicao_peca?: string;
  ano_final?: string;
  descricao_peca?: string;
  user_id: number;
  ds_imagem?: string;
  ds_imagem_dois?: string;
  ds_imagem_tres?: string;
}

@injectable()
export default class CreateModelService {
  constructor(
    @inject('PiecesRepository') private piecesRepository: IPiecesRepository,

    @inject('ModelsRepository') private modelsRepository: IModelsRepository,

    @inject('BrandsRepository') private brandsRepository: IBrandsRepository,

    @inject('ImagePieceRepository')
    private imagePieceRepository: IImagePieceRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ShopsRepository')
    private shopsRepository: IShopsRepository,

    @inject('EstablishmentsRepository')
    private establishmentsRepository: IEstablishmentsRepository,
  ) {}

  public async execute(data: IRequest): Promise<Piece | undefined> {
    // Valida????es necess??rias para criar o usu??rio
    const schema = yup.object().shape({
      id_estabelecimento: yup
        .number()
        .required('Estabelecimento n??o informado'),
      id_loja: yup.number().required('Loja n??o informada'),
      id_marca: yup.number().required('Marca n??o informada'),
      id_modelo: yup.number().required('Modelo n??o informado'),
      id_categoria: yup.number().required('Categoriia n??o informada'),
      nm_peca: yup.string().required('Nome da pe??a n??o informada'),
      valor_peca: yup.number().required('Valor da pe??a n??o informado'),
      valor_peca_oficina: yup
        .number()
        .required('Valor da pe??a na oficina n??o informado'),
      valor_peca_seguradora: yup
        .number()
        .required('Valor da pe??a na seguradora n??o informado'),
      qt_estoque: yup.number().required('Quantidade em estoquee n??o informado'),
      ano_inicial: yup.string().required('Ano inicial n??o informado'),
      is_promocional: yup.string().default(() => {
        return 'N??o';
      }),
    });

    // Valida????es
    data.altura = data.altura ? data.altura : 0;
    data.largura = data.largura ? data.largura : 0;
    data.peso_bruto = data.peso_bruto ? data.peso_bruto : 0;
    data.comprimento = data.comprimento ? data.comprimento : 0;
    data.ds_imagem = data.ds_imagem === '' ? null : data.ds_imagem;
    data.ds_imagem_dois =
      data.ds_imagem_dois === '' ? null : data.ds_imagem_dois;
    data.ds_imagem_tres =
      data.ds_imagem_tres === '' ? null : data.ds_imagem_tres;

    // Caso houver algum erro retorna com status 422
    await schema.validate(data).catch(err => {
      throw new AppError(err.message, 422);
    });

    const user = await this.usersRepository.findById(data.user_id);

    const brand = await this.brandsRepository.findByID(
      data.id_marca,
      user.id_conta,
    );
    if (!brand) {
      throw new AppError('Marca n??o encontrada');
    }

    const model = await this.modelsRepository.findByID(
      data.id_modelo,
      user.id_conta,
    );
    if (!model) {
      throw new AppError('Modelo n??o encontrado');
    }

    // Verifica se o estabelecimento esta correto
    if (data.id_estabelecimento) {
      const establishment = await this.establishmentsRepository.findById(
        data.id_estabelecimento,
      );
      // Verifica se o estabelecimento existe
      if (!establishment) {
        throw new AppError('Estabelecimento informado inv??lido');
      }
    }

    // Verifica se a loja esta correto
    if (data.id_loja) {
      const shop = await this.shopsRepository.findById(data.id_loja);
      if (!shop) {
        throw new AppError('Loja informada inv??lida');
      }
      // Verifica se tem permiss??o
      if (shop.id_estabelecimento !== user.id_estabelecimento) {
        throw new AppError(
          'Voc?? n??o tem permiss??o para criar com esta loja',
          403,
        );
      }
    }

    const countPiece = await this.piecesRepository.count({
      id_conta: 0,
      id_estabelecimento: data.id_estabelecimento,
      id_loja: data.id_loja,
    });

    // Utilizado para organizar o padLeft do c??diigo da pe??a
    function padLeft(nr: number, n: number, str: string) {
      return Array(n - String(nr).length + 1).join(str || '0') + nr;
    }

    // eslint-disable-next-line no-param-reassign
    data.codigo_peca = `EC${data.id_estabelecimento}LJ${data.id_loja}${padLeft(
      countPiece,
      3,
      '0',
    )}`;

    const piece = await this.piecesRepository.create({
      id_conta: user.id_estabelecimento,
      ...data,
      qt_disponivel: data.qt_estoque,
      is_promocional: 'N??o',
    });

    return piece;
  }
}
