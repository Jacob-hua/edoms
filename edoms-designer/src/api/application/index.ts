import { request } from '@/util/request'
import { RequestMethod } from '@edoms/utils'
import { ListApplicationsReq, ListApplicationsRes } from './type'

export const listApplications = async (data: ListApplicationsReq): Promise<ListApplicationsRes> => {
  try {
    const { result } = await request<ListApplicationsReq, ListApplicationsRes>({
      url: '/application/page',
      method: RequestMethod.POST,
      data,
    })
    return result
  } catch (error) {
    return {
      count: '0',
      limit: '0',
      page: '0',
      dataList: [],
    }
  }
}
