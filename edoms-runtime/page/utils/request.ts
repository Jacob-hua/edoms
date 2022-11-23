import { App } from 'vue';

import { AxiosResponse, ContentType, Method, Request, RequestConfig, RequestError } from '@edoms/utils';

export interface EdomsRequestConfig<T = any> extends RequestConfig {
  method?: Method;
  loading?: boolean;
  data?: T;
}

export interface ErrorInfo {
  errorCode?: string | number;
  errorMsg?: string;
}

export interface ResponseData<T> {
  errorInfo: ErrorInfo;
  result: T;
}

export interface EdomsResponse<T = any> extends AxiosResponse<ResponseData<T>, any> {
  [key: string]: any;
}

export interface EdomsError extends RequestError {
  config: EdomsRequestConfig;
  response?: EdomsResponse;
}

const service = new Request({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 1000 * 10,
  retry: 2,
  retryDelay: 1000,
  withCredentials: true,
  headers: {
    'Content-Type': ContentType.JSON,
    tenantId: 70,
  },
});

const request = <D, R>(config: EdomsRequestConfig<D>): Promise<ResponseData<R>> => {
  const { method = 'GET' } = config;
  if (method === 'GET') {
    config.params = config.data;
  }
  return service.request<ResponseData<R>>(config);
};

export default {
  install(app: App) {
    app.provide('request', request);
  },
};
