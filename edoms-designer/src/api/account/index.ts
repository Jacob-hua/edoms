import { request } from '@/util/request';

import { GetUserInfoRes, ListTenantsRes, LoginReq, LoginRes } from './type';

export * from './type';

export default {
  login: async (data: LoginReq): Promise<LoginRes> => {
    const { result } = await request<LoginReq, LoginRes>({
      url: '/user-operation/user-login',
      method: 'POST',
      data,
    });
    return result;
  },
  logout: async (): Promise<void> => {
    await request<void, void>({
      url: '/user-operation/login-out',
      method: 'POST',
    });
  },
  getUserInfo: async (): Promise<GetUserInfoRes> => {
    const { result } = await request<void, GetUserInfoRes>({
      url: '/user-operation/user-info/',
      method: 'POST',
    });
    return result;
  },
  listTenants: async (): Promise<ListTenantsRes> => {
    const { result } = await request<void, ListTenantsRes>({
      url: '/user-operation/user-tenant-list',
      method: 'GET',
    });
    return result;
  },
};
