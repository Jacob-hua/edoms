import {
  ClearTableReq,
  ClearTableRes,
  ExportOperationRecordReq,
  ExportOperationRecordRes,
  ExportTableReq,
  ExportTableRes,
  GetDicReq,
  GetDicRes,
  GetModelTypeRes,
  GetTableApiReq,
  GetTableApiRes,
  ImportFile,
  SaveApiReq,
  SaveApiRes,
  TableHistoryReq,
  TableHistoryRes,
} from '@/api/cim-model/type';
import { request } from '@/util/request';

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

export const clearTable = async (data: ClearTableReq): Promise<ClearTableRes> => {
  try {
    const { result } = await request<ClearTableReq, ClearTableRes>({
      url: `/cim-model/table/clear`,
      method: 'PUT',
      data,
    });
    return result;
  } catch (e) {
    return {
      result: null,
    };
  }
};

export const exportTable = async (data: ExportTableReq): Promise<ExportTableRes | any> => {
  try {
    const result = await request<ExportTableReq, ExportTableRes>({
      url: `/cim-model/table/export`,
      method: 'GET',
      data,
      responseType: 'blob',
    });
    return result;
  } catch (e) {
    return {
      result: null,
    };
  }
};
export const importFile = async (data: FormData): Promise<ImportFile> => {
  try {
    const { result } = await request<FormData, ImportFile>({
      url: '/cim-model/table/import',
      method: 'POST',
      data,
    });

    return result;
  } catch (error) {
    return {
      result: null,
    };
  }
};

export const saveApi = async (data: SaveApiReq): Promise<SaveApiRes> => {
  try {
    const result = await request<SaveApiReq, SaveApiRes>({
      url: '/cim-model/table/save',
      method: 'POST',
      data,
    });
    return result;
  } catch (error) {
    return {
      result: null,
    };
  }
};

export const exportOperationRecord = async (
  data: ExportOperationRecordReq
): Promise<ExportOperationRecordRes | any> => {
  try {
    const result = await request<ExportOperationRecordReq, ExportOperationRecordRes>({
      url: `/cim-model/table/history-export`,
      method: 'POST',
      data,
      responseType: 'blob',
    });
    return result;
  } catch (e) {
    return {
      result: null,
    };
  }
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

export const simulation = async (data: SaveApiReq): Promise<SaveApiRes> => {
  try {
    const result = await request<SaveApiReq, SaveApiRes>({
      url: '/cim-model/table/simulation',
      method: 'POST',
      data,
    });
    return result;
  } catch (error) {
    return {
      result: null,
    };
  }
};
