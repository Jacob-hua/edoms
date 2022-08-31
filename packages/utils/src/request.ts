import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface InterceptorHanlder<T> {
  then: (res: T) => T
  catch: (err: any) => any
}

export interface HttpInterceptors<T, R> {
  requestInterceptors?: InterceptorHanlder<T>
  responseInterceptors?: InterceptorHanlder<R>
}

export interface RequestConfig<T, R> extends AxiosRequestConfig {
  interceptors?: HttpInterceptors<T, R>
}

export class Request {
  instance: AxiosInstance
  interceptors?: HttpInterceptors<AxiosRequestConfig, AxiosResponse>

  constructor(config: RequestConfig<AxiosRequestConfig, AxiosResponse>) {
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
      this.interceptors?.requestInterceptors?.then,
      this.interceptors?.requestInterceptors?.catch
    )

    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptors?.then,
      this.interceptors?.responseInterceptors?.catch
    )

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res.data
      },
      (err: any) => {
        return err
      }
    )
  }

  request<T>(config: RequestConfig<AxiosRequestConfig, T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (config?.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors.then(config)
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config?.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors.then(res)
          }
          resolve(res)
        })
        .catch((err: any) => {
          if (config?.interceptors?.responseInterceptors) {
            config.interceptors.responseInterceptors.catch(err)
          }
          reject(err)
        })
    })
  }
}
