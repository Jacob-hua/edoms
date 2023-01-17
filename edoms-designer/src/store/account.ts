import { defineStore, Store, StoreDefinition } from 'pinia';

import type { ListTenantItem, LoginReq } from '@/api/account';
import accountApi from '@/api/account';
import type { GetApplicationRes } from '@/api/application';

export interface AccountState {
  token: string;
  userId: string;
  username: string;
  nickName: string;
  currentTenant: ListTenantItem | undefined;
  tenants: ListTenantItem[];
  curApplication?: GetApplicationRes;
}

export interface AccountGetters {
  role: (state: AccountState) => string | undefined;
}

export interface AccountActions {
  login: (data: LoginReq) => Promise<void>;
  logout: () => Promise<void>;
  refreshTenants: () => Promise<void>;
  triggerTenant: (tenantId: string) => Promise<void>;
}

export type AccountStoreDefinition = StoreDefinition<string, AccountState, AccountGetters, AccountActions>;

export type AccountStore = Store<string, AccountState, AccountGetters, AccountActions>;

const useAccountStore: AccountStoreDefinition = defineStore('account', {
  state: (): AccountState => ({
    token: '',
    userId: '',
    username: '',
    nickName: '',
    currentTenant: undefined,
    tenants: [],
  }),
  persist: true,
  getters: {
    role: (state: AccountState) => {
      if (!state.curApplication) {
        return;
      }
      return state.curApplication.edomsRoleInfoDTO.roleKey;
    },
  },
  actions: {
    async login(data: LoginReq) {
      const { token } = await accountApi.login(data);
      this.token = token;
      const { user, userTenantList } = await accountApi.getUserInfo();
      this.username = user.userName;
      this.nickName = user.nickName;
      this.userId = user.userId;
      this.tenants = userTenantList;
    },
    async logout() {
      await accountApi.logout();
      this.$reset();
    },
    async refreshTenants() {
      this.tenants = await accountApi.listTenants();
    },
    async triggerTenant(tenantId: string) {
      let currentTenant = this.tenants.find(isCurrentTenant);
      if (!currentTenant) {
        await this.refreshTenants();
        currentTenant = this.tenants.find(isCurrentTenant);
      }
      if (!currentTenant) {
        throw new Error('租户ID错误');
      }
      this.currentTenant = currentTenant;
      function isCurrentTenant(tenant: ListTenantItem) {
        return tenant.tenantId === tenantId;
      }
    },
  },
});

export default useAccountStore;
