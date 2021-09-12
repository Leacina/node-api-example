export default interface ICreateEstablishmentDto {
  id_conta: number;
  nm_estabelecimento: string;
  razao_social: string;
  cnpj_cpf: string;
  responsavel: string;
  cidade: string;
  estado: string;
  quantidade_lojas: number;
  telefone_responsavel: string;
}
