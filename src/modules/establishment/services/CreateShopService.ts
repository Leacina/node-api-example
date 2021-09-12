import { injectable, inject } from 'tsyringe';
import * as yup from 'yup';
import AppError from '@shared/errors/AppError';
import IAccountsRepository from '@modules/users/repositories/IAccountsRepository';
import IEstablishmentsRepository from '../repositories/IEstablishmentsRepository';
import Shop from '../infra/typeorm/entities/Shop';
import IShopsRepository from '../repositories/IShopsRepository';
import ICreateShopDTO from '../dtos/ICreateShopDTO';

@injectable()
export default class CreateShopService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param shopsRepository
   */
  constructor(
    @inject('ShopsRepository')
    private shopsRepository: IShopsRepository,

    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,

    @inject('EstablishmentsRepository')
    private establishmentsRepository: IEstablishmentsRepository,
  ) {}

  public async execute({
    pais,
    bairro,
    cep,
    cidade,
    complemento,
    email,
    endereco,
    estado,
    fone_principal,
    fone_skype,
    fone_whats,
    id_estabelecimento,
    imagem_loja,
    nm_loja,
    id_conta,
    cnpj_cpf,
    numero,
  }: ICreateShopDTO): Promise<Shop | undefined> {
    const data = {
      pais,
      bairro,
      cep,
      cidade,
      complemento,
      email,
      endereco,
      estado,
      fone_principal,
      fone_skype,
      fone_whats,
      id_estabelecimento,
      imagem_loja,
      nm_loja,
      id_conta,
      cnpj_cpf,
      numero,
    };

    const schema = yup.object().shape({
      nm_loja: yup.string().required('Nome da loja não informado'),
      // id_conta: yup.number().required('Conta não informada'),
      id_estabelecimento: yup
        .number()
        .required('Estabelecimento não informado'),
      cnpj_cpf: yup.string().required('CNPJ/CPF não informado'),
      estado: yup.string().required('Estado não informado').max(2),
    });

    // Caso houver algum erro retorna com status 422
    await schema
      .validate({
        nm_loja,
        id_conta,
        id_estabelecimento,
        cnpj_cpf,
        estado,
      })
      .catch(err => {
        throw new AppError(err.message, 422);
      });

    // const account = await this.accountsRepository.findById(id_conta);
    // if (!account) {
    //  throw new AppError('Conta informada não encontrada', 422);
    // }

    const establishment = await this.establishmentsRepository.findById(
      id_estabelecimento,
    );
    if (!establishment) {
      throw new AppError('Estabelecimento informado não encontrada', 422);
    }

    data.id_conta = establishment.id_conta;

    const shop = await this.shopsRepository.create(data);

    return shop;
  }
}
