import { ElLoading, ElMessage } from 'element-plus';

import type { EdomsError, EdomsRequestConfig, EdomsResponse, EdomsResponseData } from '@edoms/utils';
import { ContentType, Request, RequestCanceler } from '@edoms/utils';

import router from '@/router';
import useAccountStore, { AccountStore } from '@/store/account';

export interface LoadingService {
  close: () => void;
  [key: string]: any;
}

const requestCanceler = new RequestCanceler<EdomsRequestConfig>();

let loadingService: LoadingService;

let accountStore: AccountStore | null = null;

const requestInterceptors = (config: EdomsRequestConfig) => {
  requestCanceler.pendingRequest(config);

  if (!accountStore) {
    accountStore = useAccountStore();
  }
  config.headers = config.headers ?? {};
  accountStore.currentTenant?.tenantId && (config.headers['tenantId'] = accountStore.currentTenant?.tenantId);
  accountStore.token && (config.headers['Authorization'] = accountStore.token);

  if (!config.loading) {
    return config;
  }
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
  requestCanceler.confirmRequest(response.config);

  if (data.errorInfo && data.errorInfo.errorCode) {
    ElMessage.error(data.errorInfo.errorMsg);
  }
  if (loadingService) {
    loadingService.close();
  }
  return response;
};

const responseInterceptorsCatch = (error: EdomsError) => {
  const { response } = error;

  if (response) {
    if (response.status === 401) {
      router.push({
        path: '/login',
      });
      ElMessage.error('应用设计角色变更，权限失效');
    }
    if (response.status === 404) {
      ElMessage.error('服务器资源不存在');
    } else if (response.data) {
      const res = response.data as EdomsResponseData<any>;
      if (res.errorInfo && res.errorInfo.errorCode) {
        if (res.errorInfo.errorCode === 'EDOMS-20005') {
          requestCanceler.cancelAllRequest();
          router.push({
            path: '/login',
          });
        }
        ElMessage.error(res.errorInfo.errorMsg);
      }
    }
  }

  if (loadingService) {
    loadingService.close();
  }

  error.response?.config && requestCanceler.cancelRequest(error.response?.config);

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
