export default interface ICreateUserDto {
  ds_login: string;
  nm_usuario: string;
  ds_senha: string;
  id_conta?: number;
  id_perfil: number;
  is_ativo?: string;
  tp_usuario?: string;
  id_loja?: number;
  id_estabelecimento: number;
  telefone?: string;
}
