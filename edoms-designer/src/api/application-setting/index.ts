import { RequestMethod } from '@edoms/utils';

import { DeleteApplicationReq } from '@/api/application-setting/type';
import { request } from '@/util/request';

export const deleteApplication = async (data: DeleteApplicationReq): Promise<any> => {
  try {
    return await request<DeleteApplicationReq, string>({
      url: '/application/delete',
      method: RequestMethod.DELETE,
      data,
    });
  } catch (e: any) {
    return {
      errorInfo: {
        errorCode: e,
        errorMsg: '',
      },
      result: '',
    };
  }
};
