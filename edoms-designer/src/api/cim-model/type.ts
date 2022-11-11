export interface GetDicReq {
  mark: string;
}

export interface Dic {
  id: number;
  name: string;
  value: string;
  sort: string;
  remark: string;
}

export interface GetDicRes {
  dataList: Dic[];
}

export interface GetModelTypeRes {
  modelTypeId: number | null;
  modelType: string | null;
}
