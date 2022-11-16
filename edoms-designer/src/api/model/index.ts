import { request, ResponseData } from '@/util/request';

import {
  ClearTableReq,
  ClearTableRes,
  ExportOperationRecordReq,
  ExportTableReq,
  GetDicReq,
  GetDicRes,
  GetModelTypeRes,
  GetTableApiReq,
  GetTableApiRes,
  ImportFile,
  InstanceItem,
  ListInstanceReq,
  ListPointReq,
  PointItem,
  SaveApiReq,
  SaveApiRes,
  TableHistoryReq,
  TableHistoryRes,
} from './type';

export * from './type';

export const listInstance = async (data: ListInstanceReq): Promise<InstanceItem[]> => {
  try {
    const { result } = await request<ListInstanceReq, InstanceItem[]>({
      url: '/common/cim-energy/system-device-tree',
      method: 'POST',
      data,
    });
    return result;
  } catch (error) {
    return [];
  }
};

export const listPointCode = async (data: ListPointReq): Promise<PointItem[]> => {
  try {
    const { result } = await request<ListPointReq, PointItem[]>({
      url: '/common/model/point-code-list',
      method: 'POST',
      data,
    });
    return result;
  } catch (error) {
    return [];
  }
};

export const getDicData = async (data: GetDicReq): Promise<GetDicRes> => {
  try {
    const { result } = await request<GetDicReq, GetDicRes>({
      url: '/dic-data/list',
      method: 'GET',
      data,
    });
    return result ?? [];
  } catch (error) {
    return {
      dataList: [],
    };
  }
};

export const getModelType = async (): Promise<GetModelTypeRes> => {
  try {
    const { result } = await request<any, GetModelTypeRes>({
      url: '/cim-model/table/model-type/get',
      method: 'GET',
    });
    return result;
  } catch (e) {
    return {
      modelTypeId: null,
      modelType: null,
    };
  }
};

export const getTableHistory = async (data: TableHistoryReq): Promise<TableHistoryRes> => {
  try {
    const { result } = await request<TableHistoryReq, TableHistoryRes>({
      url: '/cim-model/table/history',
      method: 'POST',
      data,
    });
    return result;
  } catch (e) {
    return {
      page: '',
      limit: '',
      count: '',
      dataList: [],
    };
  }
};

export const clearTable = async (data: ClearTableReq) => {
  await request<ClearTableReq, ClearTableRes>({
    url: `/cim-model/table/clear`,
    method: 'PUT',
    data,
  });
};

export const exportTable = async (data: ExportTableReq) => {
  await request<ExportTableReq, void>({
    url: `/cim-model/table/export`,
    method: 'GET',
    data,
    responseType: 'blob',
  });
};
export const importFile = async (data: FormData) => {
  await request<FormData, ImportFile>({
    url: '/cim-model/table/import',
    method: 'POST',
    data,
  });
};
export const saveApi = async (data: SaveApiReq) => {
  await request<SaveApiReq, void>({
    url: '/cim-model/table/save',
    method: 'POST',
    data,
  });
};

export const exportOperationRecord = async (data: ExportOperationRecordReq) => {
  await request<ExportOperationRecordReq, void>({
    url: `/cim-model/table/history-export`,
    method: 'POST',
    data,
    responseType: 'blob',
  });
};

export const getTableApi = async (data: GetTableApiReq): Promise<GetTableApiRes> => {
  try {
    const { result } = await request<GetTableApiReq, GetTableApiRes>({
      url: `/cim-model/table/get`,
      method: 'GET',
      data,
    });
    return result;
  } catch (e) {
    return {
      body: [],
      cookie: [],
      dicCimId: '',
      header: [],
      id: '',
      method: '',
      params: [],
      path: '',
    };
  }
};

export const simulation = async (data: SaveApiReq): Promise<ResponseData<any>> => {
  return await request<SaveApiReq, SaveApiRes>({
    url: '/cim-model/table/simulation',
    method: 'POST',
    data,
  });
};
