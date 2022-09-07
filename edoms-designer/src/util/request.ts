import { Request, RequestConfig, AxiosResponse } from '@edoms/utils'
import { ElMessage, ElLoading } from 'element-plus'
import { ContentType, RequestMethod } from '@/enums/http'

export interface EdomsRequestConfig<T> extends RequestConfig {
  method: RequestMethod
  data?: T
}

export interface ErrorInfo {
  errorCode?: string | number
  errorMsg?: string
}

export interface EdomsResponse<T = any> {
  errorInfo: ErrorInfo
  result: T
}

export interface LoadingService {
  close: () => void
  [key: string]: any
}

const service = new Request({
  baseURL: 'http://localhost:8890/api/edoms/design-time',
  timeout: 1000 * 10,
  withCredentials: true,
  headers: {
    'Content-Type': ContentType.JSON,
  },
  interceptors: {
    requestInterceptors(config) {
      return config
    },
    requestInterceptorsCatch(error) {
      return Promise.reject(error)
    },
    responseInterceptors(response) {
      const { data } = response as unknown as AxiosResponse
      if (data.errorInfo && data.errorInfo.errorCode) {
        ElMessage({
          type: 'error',
          message: data.errorInfo.errorMsg,
        })
      }
      return response
    },
    responseInterceptorsCatch(error) {
      const response = error.response
      const res = response.data as EdomsResponse
      if (res.errorInfo.errorCode) {
        ElMessage({
          type: 'error',
          message: res.errorInfo.errorMsg,
        })
        return
      }
      if (response.status === 404) {
        ElMessage({
          type: 'error',
          message: '请求地址不存在',
        })
      } else {
        ElMessage({
          type: 'error',
          message: '请求异常',
        })
      }

      return Promise.reject(error)
    },
  },
})

export const request = <D, R>(config: EdomsRequestConfig<D>) => {
  const { method = RequestMethod.GET } = config
  if (method === RequestMethod.GET) {
    config.params = config.data
  }
  let loading: LoadingService
  config.interceptors = {
    requestInterceptors(config) {
      loading = ElLoading.service({
        lock: false,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      return config
    },
    requestInterceptorsCatch(error) {
      if (loading) {
        loading.close()
      }
      return Promise.reject(error)
    },
    responseInterceptors(response) {
      if (loading) {
        loading.close()
      }
      return response
    },
    responseInterceptorsCatch(error) {
      if (loading) {
        loading.close()
      }
      return Promise.reject(error)
    },
  }
  return service.request<EdomsResponse<R>>(config)
}
