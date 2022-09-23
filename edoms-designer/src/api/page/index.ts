import { RequestMethod } from '@edoms/utils'
import { request } from '@/util/request'
import { ListPageInfosReq, ListPageInfosRes } from './type'

export const listPages = async (data: ListPageInfosReq): Promise<ListPageInfosRes> => {
  try {
    const { result } = await request<ListPageInfosReq, ListPageInfosRes>({
      url: '/page/list',
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
