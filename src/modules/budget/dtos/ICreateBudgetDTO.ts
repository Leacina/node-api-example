export default interface ICreateBudgetDTO {
  id_conta?: number;
  id_estabelecimento: number;
  id_loja: number;
  emitente: string;
  emitente_email: string;
  emitente_telefone: string;
  situacao: string;
}
