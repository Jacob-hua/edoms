export interface LoginReq {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
}

export interface LoginRes {
  /** 令牌 */
  token: string;
}

export interface ListTenantItem {
  /** 租戶 ID 數字孿生 */
  dataCode: string;
  /** 租户ID */
  tenantId: string;
  /** 租户名称 */
  proName: string;
}

export interface GetUserInfoRes {
  /** 权限列表 */
  permissions: string[];
  /** 项目列表 */
  userProList: ListTenantItem[];
  /** 用户信息 */
  user: {
    /** 用户ID */
    userId: string;
    /** 用户名称 */
    userName: string;
    /** 用户昵称 */
    nickName: string;
  };
}

export type ListTenantsRes = ListTenantItem[];
