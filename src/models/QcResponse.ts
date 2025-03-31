type ItemQc = {
  qcList: {
    url: string;
    time: number;
    format: string;
  }[];
  findqcDetailUrl: string;
  qcCount: number;
};

export type QcResponse = Promise<{
  state: number;
  msg: string;
  data: ItemQc;
}>;
