declare namespace Express {
  export interface Request {
    user: {
      id: number;
      establishment_id: number;
      shop_id?: number;
    };
  }
}
