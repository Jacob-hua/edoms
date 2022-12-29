import { EdomsResponseData } from '@edoms/utils';

import { request } from '@/util/request';

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

export default {
  listInstance: async (data: ListInstanceReq): Promise<ListInstanceRes> => {
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
  },
  listPointCode: async (data: ListPointReq): Promise<ListPointRes> => {
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
  },
  getStaticDicData: async (data: GetDicReq): Promise<GetDicRes> => {
    try {
      const { result } = await request<GetDicReq, GetDicRes>({
        url: '/cim-model/table/static-table/list',
        method: 'GET',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  getDynamicDicData: async (data: GetDicReq): Promise<GetDicRes> => {
    try {
      const { result } = await request<GetDicReq, GetDicRes>({
        url: '/cim-model/table/dynamic-api/list',
        method: 'GET',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  getModelType: async (): Promise<GetModelTypeRes> => {
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
  },
  clearTable: async (data: ClearTableReq): Promise<void> => {
    await request<ClearTableReq, void>({
      url: `/cim-model/table/clear`,
      method: 'PUT',
      data,
    });
  },
  exportTable: async (data: ExportTableReq): Promise<any> => {
    return await request<ExportTableReq, any>({
      url: `/cim-model/table/export`,
      method: 'GET',
      data,
      responseType: 'blob',
    });
  },
  importTable: async (data: ImportTableReq): Promise<void> => {
    const formData = new FormData();
    formData.set('file', data.file!);
    formData.set('tableId', data.tableId);
    formData.set('fileName', data.fileName);

    await request<FormData, void>({
      url: '/cim-model/table/import',
      method: 'POST',
      data: formData,
    });
  },
  getTableHistory: async (data: TableHistoryReq): Promise<TableHistoryRes> => {
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
  },
  exportTableHistory: async (data: ExportTableHistoryReq): Promise<any> => {
    return await request<ExportTableHistoryReq, any>({
      url: `/cim-model/table/history-export`,
      method: 'POST',
      data,
      responseType: 'blob',
    });
  },
  saveApi: async (data: SaveApiReq): Promise<void> => {
    await request<SaveApiReq, void>({
      url: '/cim-model/table/save',
      method: 'POST',
      data,
    });
  },
  getApi: async (data: GetApiReq): Promise<GetApiRes> => {
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
  },
  simulationApi: async (data: SimulationApiReq): Promise<EdomsResponseData<any>> => {
    return await request<SimulationApiReq, EdomsResponseData<any>>({
      url: '/cim-model/table/simulation',
      method: 'POST',
      data,
    });
  },
  updateModelType: async (data: UpdateModelTypeReq): Promise<void> => {
    await request<UpdateModelTypeReq, void>({
      url: '/cim-model/table/model-type/update',
      method: 'PUT',
      data,
    });
  },
};
