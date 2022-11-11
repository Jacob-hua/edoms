import { ElLoading, ElMessage } from 'element-plus';

import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  ContentType,
  Request,
  RequestConfig,
  RequestMethod,
} from '@edoms/utils';

export interface EdomsRequestConfig<T = any> extends RequestConfig {
  method: RequestMethod;
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

export interface EdomsResponse<T = any> extends AxiosResponse<ResponseData<T>, any> {}

export interface EdomsError extends AxiosError<any, any> {
  config: EdomsRequestConfig;
  response?: EdomsResponse;
}

export interface LoadingService {
  close: () => void;
  [key: string]: any;
}

let loadingService: LoadingService;

const requestInterceptors = (config: AxiosRequestConfig) => {
  if (loadingService) {
    loadingService.close();
  }
  loadingService = ElLoading.service({
    lock: false,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  return config;
};

const requestInterceptorsCatch = (error: EdomsError) => {
  if (loadingService) {
    loadingService.close();
  }
  return Promise.reject(error);
};

const responseInterceptors = <T>(response: T) => {
  const { data } = response as EdomsResponse;
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
};

const responseInterceptorsCatch = (error: EdomsError) => {
  const { code = '', response, config } = error;

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

  if (response) {
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
    const res = response.data as ResponseData<any>;
    if (res.errorInfo && res.errorInfo.errorCode) {
      ElMessage({
        type: 'error',
        message: res.errorInfo.errorMsg,
      });
    }
  }

  if (loadingService) {
    loadingService.close();
  }

  return Promise.reject(error);
};

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
  interceptors: {
    requestInterceptors,
    requestInterceptorsCatch,
    responseInterceptors,
    responseInterceptorsCatch,
  },
});

export const request = <D, R>(config: EdomsRequestConfig<D>) => {
  const { method = RequestMethod.GET } = config;
  if (method === RequestMethod.GET) {
    config.params = config.data;
  }
  return service.request<ResponseData<R>>(config);
};
