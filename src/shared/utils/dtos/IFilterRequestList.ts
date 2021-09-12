export default interface IFilterRequestList {
  search?: string;
  page?: number;
  pageSize?: number;
  ignorePage?: boolean;

  // Filtros para as peças e cadastros usados sem login do usuario
  ignoreEstablishment?: boolean;
}
