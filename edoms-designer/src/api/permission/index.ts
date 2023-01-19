import {
  GetUserListReq,
  PermissionAdd,
  PermissionDeleteReq,
  PermissionListReq,
  PermissionListRes,
  Role,
  User,
} from '@/api/permission/type';
import { request } from '@/util/request';
export * from './type';

export default {
  permissionList: async (data: PermissionListReq): Promise<PermissionListRes> => {
    try {
      const { result } = await request<PermissionListReq, PermissionListRes>({
        url: '/permission/list',
        method: 'POST',
        data,
      });
      return result;
    } catch (e) {
      return {
        count: 0,
        limit: 0,
        page: 0,
        applicationId: '',
        applicationName: '',
        dataList: [],
      };
    }
  },
  userList: async (data: GetUserListReq): Promise<User[]> => {
    try {
      const { result } = await request<GetUserListReq, User[]>({
        url: '/permission/user-list',
        method: 'GET',
        data,
      });
      return result;
    } catch (e) {
      return [];
    }
  },
  roleList: async (): Promise<Role[]> => {
    try {
      const { result } = await request<void, Role[]>({
        url: '/permission/role-list',
        method: 'GET',
      });
      return result;
    } catch (e) {
      return [];
    }
  },
  permissionAdd: async (data: PermissionAdd): Promise<void> => {
    await request<PermissionAdd, void>({
      url: '/permission/add',
      method: 'POST',
      data,
    });
  },
  permissionDelete: async (data: PermissionDeleteReq): Promise<void> => {
    await request<PermissionDeleteReq, void>({
      url: '/permission/delete',
      method: 'DELETE',
      data,
    });
  },
};
