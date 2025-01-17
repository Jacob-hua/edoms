import { App } from 'vue';

import { ContentType, EdomsRequestConfig, EdomsRequestFunc, EdomsResponseData, Request } from '@edoms/utils';

const service = new Request({
  baseURL: '/edoms-runtime-service-dev/edoms/run-time',
  timeout: 1000 * 10,
  retry: 2,
  retryDelay: 1000,
  withCredentials: true,
  headers: {
    'Content-Type': ContentType.JSON,
    tenantId: 70,
  },
});

const request = <D, R>(config: EdomsRequestConfig<D>): Promise<EdomsResponseData<R>> => {
  const { method = 'GET' } = config;
  if (method === 'GET') {
    config.params = config.data;
  }
  return service.request<EdomsResponseData<R>>(config);
};

export default {
  install(app: App) {
    app.provide<EdomsRequestFunc>('request', request);
  },
};
