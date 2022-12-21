import { useRouter } from 'vue-router';
import { defineStore, Store, StoreDefinition } from 'pinia';

import type { ListTenantItem, LoginReq } from '@/api/account';
import accountApi from '@/api/account';

const router = useRouter();

export interface AccountState {
  token: string;
  userId: string;
  username: string;
  nickName: string;
  currentTenant: ListTenantItem | undefined;
  tenants: ListTenantItem[];
}

export interface AccountAction {
  login: (data: LoginReq) => Promise<void>;
  logout: () => Promise<void>;
  refreshTenants: () => Promise<void>;
  triggerTenant: (tenantId: string) => Promise<void>;
}

export type AccountStoreDefinition = StoreDefinition<string, AccountState, Record<string, any>, AccountAction>;

export type AccountStore = Store<string, AccountState, Record<string, any>, AccountAction>;

const useAccountStore: AccountStoreDefinition = defineStore('account', {
  state: (): AccountState => ({
    token: '',
    userId: '',
    username: '',
    nickName: '',
    currentTenant: undefined,
    tenants: [],
  }),
  actions: {
    async login(data: LoginReq) {
      const { token } = await accountApi.login(data);
      this.token = token;
      const { user, userTenantList } = await accountApi.getUserInfo();
      this.username = user.userName;
      this.nickName = user.nickName;
      this.userId = user.userId;
      this.tenants = userTenantList;
      router.push({
        path: '/',
      });
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
