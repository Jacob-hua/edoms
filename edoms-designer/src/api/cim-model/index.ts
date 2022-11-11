import { RequestMethod } from '@edoms/utils';

import { GetDicReq, GetDicRes, GetModelTypeRes } from '@/api/cim-model/type';
import { request } from '@/util/request';

export const getDicData = async (data: GetDicReq): Promise<GetDicRes> => {
  try {
    const { result } = await request<GetDicReq, GetDicRes>({
      url: '/dic-data/list',
      method: RequestMethod.GET,
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
      method: RequestMethod.GET,
    });
    return result;
  } catch (e) {
    return {
      modelTypeId: null,
      modelType: null,
    };
  }
};
