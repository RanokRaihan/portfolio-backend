export interface IMeta {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface IResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  meta?: IMeta;
}
