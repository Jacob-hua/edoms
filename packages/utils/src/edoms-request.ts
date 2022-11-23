import { AxiosResponse, Method, RequestConfig, RequestError } from './request';

export interface EdomsRequestConfig<T = any> extends RequestConfig {
  method?: Method;
  loading?: boolean;
  data?: T;
}

export interface ErrorInfo {
  errorCode?: string | number;
  errorMsg?: string;
}

export interface EdomsResponseData<T> {
  errorInfo: ErrorInfo;
  result: T;
}

export interface EdomsResponse<T = any> extends AxiosResponse<EdomsResponseData<T>, any> {
  [key: string]: any;
}

export interface EdomsError extends RequestError {
  config: EdomsRequestConfig;
  response?: EdomsResponse;
}
