import { request } from '@/util/request'
import { RequestMethod } from '@edoms/utils'
import { AppForm, createAppRes, FileUploadRes, ListApplicationsReq, ListApplicationsRes } from './type'

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

export const createApplication = async (data: AppForm): Promise<createAppRes> => {
  try {
    const { result } = await request<AppForm, createAppRes>({
      url: '/application/create',
      method: RequestMethod.POST,
      data,
    })
    return result
  } catch (error) {
    return {
      applicationId: null,
    }
  }
}

export const fileUpload = async (data: FormData): Promise<FileUploadRes> => {
  try {
    const { result } = await request<FormData, FileUploadRes>({
      url: '/file/upload',
      method: RequestMethod.POST,
      data,
    })

    return result
  } catch (error) {
    return {
      contentId: null,
    }
  }
}
