export default class FindFilters {
  search: string[];

  constructor(search: string[]) {
    this.search = search;
  }

  public findSearch(fieldname: string): string {
    const search = this.search.find(value => value.startsWith(fieldname));

    return search ? search.split(':')[1] : '';
  }
}
