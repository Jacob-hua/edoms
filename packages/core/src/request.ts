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

export type RequestFunc = <D, R>(config: EdomsRequestConfig<D>) => Promise<ResponseData<R>>;

const defaultConfig: RequestConfig = {
  baseURL: '',
  timeout: 1000 * 10,
  withCredentials: true,
  headers: {
    'Content-Type': ContentType.JSON,
  },
};

export default (config?: RequestConfig): RequestFunc => {
  const service = new Request({
    ...defaultConfig,
    ...config,
  });

  const request: RequestFunc = <D, R>(config: EdomsRequestConfig<D>): Promise<ResponseData<R>> => {
    const { method = 'GET' } = config;
    if (method === 'GET') {
      config.params = config.data;
    }
    return service.request<ResponseData<R>>(config);
  };

  return request;
};
