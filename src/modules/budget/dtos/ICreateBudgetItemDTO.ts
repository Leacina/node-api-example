export default interface ICreateBudgetItemDTO {
  id_conta?: number;
  id_orcamento: number;
  id_peca: number;
  quantidade: number;
  valor: number;
  situacao: string;
}
