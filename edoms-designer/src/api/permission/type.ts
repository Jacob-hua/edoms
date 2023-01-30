import { PageStruct } from '@/const/struct';
export interface PermissionListReq {
  // 应用id
  applicationId: string;
  // 当前页
  page: number;
  // 当前页显示条数
  limit: number;
}
export interface Permission {
  // 用户名
  username: string;
  // 用户ID
  userId: string;
  // 权限名称
  roleName: string;
  // 控制列表删除按钮是否显示
  isDisplay: number;
}

export interface PermissionListRes extends PageStruct<Permission> {
  //应用id
  applicationId: string;
  //应用名称
  applicationName: string;
}

export interface User {
  // 用户名
  userName: string;
  // 用户id
  userId: string;
}

export interface Role {
  // 权限id
  roleId: string;
  // 权限名
  roleName: string;
}
export type GetUserListReq = Pick<PermissionListReq, 'applicationId'>;

export interface PermissionAdd {
  // 应用id
  applicationId: string;
  // 用户id
  userId: string;
  // 权限id
  roleId: string;
}

export type PermissionDeleteReq = Omit<PermissionAdd, 'roleId'>;
