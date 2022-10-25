import { ElLoading, ElMessage } from 'element-plus';

import { AxiosRequestConfig, AxiosResponse, ContentType, Request, RequestConfig, RequestMethod } from '@edoms/utils';

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

export interface LoadingService {
  close: () => void;
  [key: string]: any;
}

let loadingService: LoadingService;

const service = new Request({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 1000 * 10,
  retry: 2,
  withCredentials: true,
  headers: {
    'Content-Type': ContentType.JSON,
  },
  interceptors: {
    requestInterceptors(config: AxiosRequestConfig) {
      if (loadingService) {
        loadingService.close();
      }
      loadingService = ElLoading.service({
        lock: false,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      return config;
    },
    requestInterceptorsCatch(error: any) {
      if (loadingService) {
        loadingService.close();
      }
      return Promise.reject(error);
    },
    responseInterceptors(response) {
      const { data } = response as unknown as AxiosResponse;
      if (data.errorInfo && data.errorInfo.errorCode) {
        ElMessage({
          type: 'error',
          message: data.errorInfo.errorMsg,
        });
      }
      if (loadingService) {
        loadingService.close();
      }
      return response;
    },
    responseInterceptorsCatch(error: any) {
      const { code, response, config } = error;
      if (!code) {
        return Promise.reject(error);
      }

      if (['ECONNABORTED'].includes(code)) {
        if (config.__retryCount == config.retry) {
          ElMessage({
            type: 'error',
            message: '请求超时',
          });
          if (loadingService) {
            loadingService.close();
          }
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
      const res = response.data as EdomsResponse;
      if (res.errorInfo.errorCode) {
        ElMessage({
          type: 'error',
          message: res.errorInfo.errorMsg,
        });
        return Promise.reject(error);
      }
      if (response.status === 404) {
        ElMessage({
          type: 'error',
          message: '请求地址不存在',
        });
      } else {
        ElMessage({
          type: 'error',
          message: '请求异常',
        });
      }

      if (loadingService) {
        loadingService.close();
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
