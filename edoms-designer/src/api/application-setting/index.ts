import { DeleteApplicationReq } from '@/api/application-setting/type';
import { request } from '@/util/request';

export const deleteApplication = async (data: DeleteApplicationReq): Promise<any> => {
  return await request<DeleteApplicationReq, string>({
    url: '/application/delete',
    method: 'DELETE',
    data,
  });
};
