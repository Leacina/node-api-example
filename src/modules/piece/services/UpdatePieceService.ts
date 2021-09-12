import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import Piece from '@modules/piece/infra/typeorm/entities/Piece';
import AppError from '@shared/errors/AppError';
import * as yup from 'yup';
import IPiecesRepository from '../repositories/IPiecesRepository';
import IImagePieceRepository from '../repositories/IImagePieceRepository';

interface IRequest {
  id: number;
  id_marca?: number;
  id_modelo?: number;
  id_categoria?: number;
  nm_peca?: string;
  peca_destaque?: number;
  valor_peca?: number;
  valor_peca_oficina?: number;
  valor_peca_seguradora?: number;
  qt_disponivel?: number;
  qt_estoque?: number;
  ano_inicial?: number;
  codigo_peca?: string;
  is_promocional?: string;
  altura?: number;
  largura?: number;
  comprimento?: number;
  peso_bruto?: number;
  cor?: string;
  condicao_peca?: string;
  ano_final?: string;
  descricao_peca?: string;
  ds_imagem?: string;
  ds_imagem_dois?: string;
  ds_imagem_tres?: string;
  user_id: number;
}

@injectable()
export default class UpdatePieceService {
  constructor(
    @inject('PiecesRepository') private piecesRepository: IPiecesRepository,

    @inject('ImagePieceRepository')
    private imagePieceRepository: IImagePieceRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IRequest): Promise<Piece> {
    // Validações necessárias para criar o usuário
    const schema = yup.object().shape({
      id_estabelecimento: yup
        .number()
        .required('Estabelecimento não informado'),
      id_loja: yup.number().required('Loja não informada'),
      id_marca: yup.number().required('Marca não informada'),
      id_modelo: yup.number().required('Modelo não informado'),
      id_categoria: yup.number().required('Categoriia não informada'),
      nm_peca: yup.string().required('Nome da peça não informada'),
      valor_peca: yup.number().required('Valor da peça não informado'),
      valor_peca_oficina: yup
        .number()
        .required('Valor da peça na oficina não informado'),
      valor_peca_seguradora: yup
        .number()
        .required('Valor da peça na seguradora não informado'),
      qt_estoque: yup.number().required('Quantidade em estoquee não informado'),
      ano_inicial: yup.string().required('Ano inicial não informado'),
      codigo_peca: yup.string().required('Código da peça não informado'),
      is_promocional: yup.string().default(() => {
        return 'Não';
      }),
    });

    // Caso houver algum erro retorna com status 422
    await schema.validate(data).catch(err => {
      throw new AppError(err.message, 422);
    });

    const user = await this.usersRepository.findById(data.user_id);
    const piece = await this.piecesRepository.findByID(data.id, user.id_conta);

    // TODO: Rever essa atribuição
    if (piece) {
      piece.id_categoria = data.id_categoria || piece.id_categoria;
      piece.ano_final = data.ano_final || piece.ano_final;
      piece.ano_inicial = data.ano_inicial || piece.ano_inicial;
      piece.codigo_peca = data.codigo_peca || piece.codigo_peca;
      piece.comprimento = data.comprimento || piece.comprimento;
      piece.condicao_peca = data.condicao_peca || piece.condicao_peca;
      piece.cor = data.cor || piece.cor;
      piece.descricao_peca = data.descricao_peca || piece.descricao_peca;
      piece.id_marca = data.id_marca || piece.id_marca;
      piece.id_modelo = data.id_modelo || piece.id_modelo;
      piece.is_promocional = data.is_promocional || piece.is_promocional;
      piece.largura = data.largura || 0;
      piece.altura = data.altura || 0;
      piece.nm_peca = data.nm_peca || piece.nm_peca;
      piece.peso_bruto = data.peso_bruto || 0;

      piece.qt_estoque = data.qt_estoque || 0;
      piece.valor_peca = data.valor_peca || piece.valor_peca;
      piece.peca_destaque = data.peca_destaque || piece.peca_destaque;
      piece.valor_peca_oficina =
        data.valor_peca_oficina || piece.valor_peca_oficina;
      piece.valor_peca_seguradora =
        data.valor_peca_seguradora || piece.valor_peca_seguradora;
      piece.ds_imagem = data.ds_imagem === '' ? null : data.ds_imagem;
      piece.ds_imagem_dois =
        data.ds_imagem_dois === '' ? null : data.ds_imagem_dois;
      piece.ds_imagem_tres =
        data.ds_imagem_tres === '' ? null : data.ds_imagem_tres;

      await this.piecesRepository.save(piece);
    }

    return piece;
  }
}
