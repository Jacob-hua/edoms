import { RequestMethod } from '@edoms/utils';

import { request } from '@/util/request';

import { InstanceItem, ListInstanceReq } from './type';

export * from './type';

export const listInstance = async (data: ListInstanceReq): Promise<InstanceItem[]> => {
  try {
    const { result } = await request<ListInstanceReq, InstanceItem[]>({
      url: '/common/cimEnergy/system-device-tree',
      method: RequestMethod.POST,
      data,
    });
    return result;
  } catch (error) {
    return [];
  }
};
