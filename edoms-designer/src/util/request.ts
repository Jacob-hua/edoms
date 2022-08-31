import { Request, RequestConfig, AxiosResponse } from '@edoms/utils'
import { ElMessage } from 'element-plus'

export interface EdomsRequestConfig<T> extends RequestConfig {
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

const service = new Request({
  baseURL: 'http://127.0.0.1:8890/api/edoms/design-time',
  timeout: 1000 * 10,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
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
  const { method = 'GET' } = config
  if (['GET', 'get'].includes(method)) {
    config.params = config.data
  }
  return service.request<EdomsResponse<R>>(config)
}
