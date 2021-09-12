export default interface ICreateBudgetItemDTO {
  id_cotacao: number;
  descricao_peca: string;
  identificador_cotacao: string;
  quantidade_peca: number;
  situacao: string;
  dh_inc: Date;
}
