import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export * from 'axios'

export interface HttpInterceptors {
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorsCatch?: (error: any) => any
  responseInterceptors?: <T = AxiosResponse>(response: T) => T
  responseInterceptorsCatch?: (error: any) => any
}

export interface RequestConfig extends AxiosRequestConfig {
  interceptors?: HttpInterceptors
}

export class Request {
  instance: AxiosInstance
  interceptors?: HttpInterceptors

  constructor(config: RequestConfig) {
    this.instance = axios.create(config)
    this.interceptors = config.interceptors

    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        return config
      },
      (err: any) => {
        return err
      }
    )

    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptors,
      this.interceptors?.requestInterceptorsCatch
    )

    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptors,
      this.interceptors?.responseInterceptorsCatch
    )

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return new Promise((resolve, reject) => {
          if (res.status === 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        })
      },
      (err: any) => {
        return Promise.reject(err)
      }
    )
  }

  request<T>(config: RequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      if (config?.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config)
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config?.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors<T>(res)
          }
          resolve(res)
        })
        .catch((err: any) => {
          if (config?.interceptors?.responseInterceptorsCatch) {
            config.interceptors.responseInterceptorsCatch(err)
          }
          reject(err)
        })
    })
  }
}
