import { request, ResponseData } from '@/util/request';

import {
  ClearTableReq,
  ExportTableHistoryReq,
  ExportTableReq,
  GetApiReq,
  GetApiRes,
  GetDicReq,
  GetDicRes,
  GetModelTypeRes,
  ImportTableReq,
  ListInstanceReq,
  ListInstanceRes,
  ListPointReq,
  ListPointRes,
  SaveApiReq,
  SimulationApiReq,
  TableHistoryReq,
  TableHistoryRes,
  UpdateModelTypeReq,
} from './type';

export * from './type';

export const listInstance = async (data: ListInstanceReq): Promise<ListInstanceRes> => {
  try {
    const { result } = await request<ListInstanceReq, ListInstanceRes>({
      url: '/common/cim-energy/system-device-tree',
      method: 'POST',
      data,
    });
    return result;
  } catch (error) {
    return [];
  }
};

export const listPointCode = async (data: ListPointReq): Promise<ListPointRes> => {
  try {
    const { result } = await request<ListPointReq, ListPointRes>({
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
    return result;
  } catch (error) {
    return [];
  }
};

export const getModelType = async (): Promise<GetModelTypeRes> => {
  try {
    const { result } = await request<void, GetModelTypeRes>({
      url: '/cim-model/table/model-type/get',
      method: 'GET',
    });
    return result;
  } catch (e) {
    return {
      modelTypeId: 1,
      modelType: '0',
    };
  }
};

export const clearTable = async (data: ClearTableReq): Promise<void> => {
  await request<ClearTableReq, void>({
    url: `/cim-model/table/clear`,
    method: 'PUT',
    data,
  });
};

export const exportTable = async (data: ExportTableReq): Promise<any> => {
  return await request<ExportTableReq, any>({
    url: `/cim-model/table/export`,
    method: 'GET',
    data,
    responseType: 'blob',
  });
};

export const importTable = async (data: ImportTableReq): Promise<void> => {
  const formData = new FormData();
  formData.set('file', data.file!);
  formData.set('tableId', data.tableId);
  formData.set('fileName', data.fileName);

  await request<FormData, void>({
    url: '/cim-model/table/import',
    method: 'POST',
    data: formData,
  });
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
      page: 0,
      limit: 0,
      count: 0,
      dataList: [],
    };
  }
};

export const exportTableHistory = async (data: ExportTableHistoryReq): Promise<any> => {
  return await request<ExportTableHistoryReq, any>({
    url: `/cim-model/table/history-export`,
    method: 'POST',
    data,
    responseType: 'blob',
  });
};

export const saveApi = async (data: SaveApiReq): Promise<void> => {
  await request<SaveApiReq, void>({
    url: '/cim-model/table/save',
    method: 'POST',
    data,
  });
};

export const getApi = async (data: GetApiReq): Promise<GetApiRes> => {
  try {
    const { result } = await request<GetApiReq, GetApiRes>({
      url: `/cim-model/table/get`,
      method: 'GET',
      data,
    });
    return result;
  } catch (e) {
    return {
      body: [],
      cookie: [],
      dicCimId: -1,
      header: [],
      method: '',
      params: [],
      path: '',
    };
  }
};

export const simulationApi = async (data: SimulationApiReq): Promise<ResponseData<any>> => {
  return await request<SimulationApiReq, ResponseData<any>>({
    url: '/cim-model/table/simulation',
    method: 'POST',
    data,
  });
};

export const updateModelType = async (data: UpdateModelTypeReq): Promise<void> => {
  await request<UpdateModelTypeReq, void>({
    url: '/cim-model/table/model-type/update',
    method: 'PUT',
    data,
  });
};
