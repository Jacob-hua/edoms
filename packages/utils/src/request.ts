import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export * from 'axios';

export const enum ContentType {
  // json
  JSON = 'application/json;charset=UTF-8',
  // text
  TEXT = 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data 上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

export interface HttpInterceptors {
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorsCatch?: (error: any) => any;
  responseInterceptors?: <T = AxiosResponse>(response: T) => T;
  responseInterceptorsCatch?: (error: any) => any;
}

export interface RequestConfig extends AxiosRequestConfig {
  interceptors?: HttpInterceptors;
  retry?: number;
  retryDelay?: number;
  __retryCount?: number;
}

export interface RequestError extends AxiosError<any, any> {
  config: RequestConfig;
}

export class Request {
  instance: AxiosInstance;
  interceptors?: HttpInterceptors;

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors;

    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        return config;
      },
      (err: any) => {
        return err;
      }
    );

    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptors,
      this.interceptors?.requestInterceptorsCatch
    );

    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptors,
      this.interceptors?.responseInterceptorsCatch
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return new Promise((resolve, reject) => {
          if (res.status === 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        });
      },
      async (err: RequestError) => {
        const { code = '', config } = err;
        if (!config || !config.retry || !['ECONNABORTED'].includes(code)) {
          return Promise.reject(err);
        }
        config.__retryCount = config.__retryCount ?? 0;
        if (config.__retryCount >= config.retry) {
          return Promise.reject(err);
        }

        config.__retryCount += 1;

        const backoff = new Promise((resolve) => {
          setTimeout(() => {
            resolve(undefined);
          }, config.retryDelay ?? 1);
        });

        await backoff;
        return await this.request(config);
      }
    );
  }

  request<T>(config: RequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      if (config?.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config);
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config?.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors<T>(res);
          }
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}
