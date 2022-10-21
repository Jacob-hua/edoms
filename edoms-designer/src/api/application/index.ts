import { EdomsResponse, request } from '@/util/request'
import { RequestMethod } from '@edoms/utils'
import { AppForm, CreateAppRes, FileUploadRes, ListApplicationsReq, ListApplicationsRes } from './type'

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

export const createApplication = async (data: AppForm): Promise<CreateAppRes> => {
  try {
    const { result } = await request<AppForm, CreateAppRes>({
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
export const updateApplication = async (data: AppForm): Promise<EdomsResponse<string>> => {
  try {
    return await request<AppForm, string>({
      url: '/application/update',
      method: RequestMethod.PUT,
      data,
    })
  } catch (error) {
    return {
      errorInfo: {
        errorCode: '',
        errorMsg: '',
      },
      result: '',
    }
  }
}
