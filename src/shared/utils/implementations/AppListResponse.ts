class ListResponse {
  public readonly hasNext: boolean;

  public readonly items: number;

  public readonly page: number;

  public readonly pageSize: number;

  public readonly size: number;

  constructor(
    items: any,
    page: number,
    pageSize: number,
    ignorePage?: boolean,
  ) {
    this.page = page || 1;
    this.pageSize = pageSize || 10;
    this.hasNext = items.length > this.pageSize;

    if (items.length > 1 && this.hasNext && !ignorePage) {
      items.pop();
    }

    this.size = items.length;
    this.items = items;
  }
}

export default ListResponse;
