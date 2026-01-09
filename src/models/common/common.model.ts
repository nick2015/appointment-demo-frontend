export interface IResponse<T> {
  state: string;
  msg: string;
  data?: T;
}