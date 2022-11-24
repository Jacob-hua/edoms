import { ElLoading, ElMessage } from 'element-plus';

import { ContentType, EdomsError, EdomsRequestConfig, EdomsResponse, EdomsResponseData, Request } from '@edoms/utils';

export interface LoadingService {
  close: () => void;
  [key: string]: any;
}

let loadingService: LoadingService;

const requestInterceptors = (config: EdomsRequestConfig) => {
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

const responseInterceptors = (response: any) => {
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
  const { response } = error;

  if (response) {
    if (response.status === 404) {
      ElMessage({
        type: 'error',
        message: '请求地址不存在',
      });
    } else if (response.data) {
      const res = response.data as EdomsResponseData<any>;
      if (res.errorInfo && res.errorInfo.errorCode) {
        ElMessage({
          type: 'error',
          message: res.errorInfo.errorMsg,
        });
      }
    } else {
      ElMessage({
        type: 'error',
        message: '请求异常',
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

export const request = <D, R>(config: EdomsRequestConfig<D>): Promise<EdomsResponseData<R>> => {
  const { method = 'GET' } = config;
  if (method === 'GET') {
    config.params = config.data;
  }
  return service.request<EdomsResponseData<R>>(config);
};
