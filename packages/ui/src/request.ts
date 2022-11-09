import { elMessage } from '@edoms/design';
import { AxiosResponse, ContentType, Request, RequestConfig, RequestMethod } from '@edoms/utils';

export interface EdomsRequestConfig<T> extends RequestConfig {
  method: RequestMethod;
  loading?: boolean;
  data?: T;
}

export interface ErrorInfo {
  errorCode?: string | number;
  errorMsg?: string;
}

export interface EdomsResponse<T = any> {
  errorInfo: ErrorInfo;
  result: T;
}

const service = new Request({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 1000 * 10,
  retry: 2,
  withCredentials: true,
  headers: {
    'Content-Type': ContentType.JSON,
  },
  interceptors: {
    responseInterceptors(response) {
      const { data } = response as unknown as AxiosResponse;
      if (data.errorInfo && data.errorInfo.errorCode) {
        elMessage.error(data.errorInfo.errorMsg);
      }
      return response;
    },
    responseInterceptorsCatch(error) {
      const { code, response, config } = error;
      if (!code) {
        return Promise.reject(error);
      }

      if (['ECONNABORTED'].includes(code)) {
        if (config.__retryCount == config.retry) {
          elMessage.error('请求超时');
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
      const res = response.data as EdomsResponse;
      if (res.errorInfo.errorCode) {
        elMessage.error(res.errorInfo.errorMsg ?? '');
        return Promise.reject(error);
      }
      if (response.status === 404) {
        elMessage.error('请求地址不存在');
      } else {
        elMessage.error('请求异常');
      }
      return Promise.reject(error);
    },
  },
});

export const request = <D, R>(config: EdomsRequestConfig<D>) => {
  const { method = RequestMethod.GET } = config;
  if (method === RequestMethod.GET) {
    config.params = config.data;
  }
  return service.request<EdomsResponse<R>>(config);
};
