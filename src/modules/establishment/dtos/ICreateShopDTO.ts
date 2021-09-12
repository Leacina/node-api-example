export default interface ICreateEstablishmentDto {
  id_conta: number;
  id_estabelecimento: number;
  nm_loja: string;
  cnpj_cpf: string;
  estado: string;
  cidade?: string;
  bairro?: string;
  pais?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  fone_principal?: string;
  fone_whats?: string;
  fone_skype?: string;
  email?: string;
  imagem_loja?: string;
}
