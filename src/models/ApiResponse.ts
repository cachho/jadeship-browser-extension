export type ApiResponse<T> = {
  msg: string;
  serverTime: number;
  state: 0 | 1;
  data?: T;
};
