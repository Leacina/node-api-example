export default interface ICreateUserLegalInfoDto {
  id_usuario: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  inscricao_estadual: string;
  endereco?: string;
  telefone: string;
  email?: string;
  site?: string;
  responsavel?: string;
  cpf_responsavel?: string;
  celular_responsavel?: string;
  email_responsavel?: string;
}
