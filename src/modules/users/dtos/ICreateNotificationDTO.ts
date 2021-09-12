export default interface ICreateNotificationDTO {
  mensagem: string;
  id_usuario?: number;
  id_cotacao?: number;
  id_orcamento?: number;
  id_loja?: number;
}
