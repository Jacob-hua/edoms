import { defineStore } from 'pinia';

import type { ListTenantItem, LoginReq } from '@/api/account';
import accountApi from '@/api/account';

const useAccountStore = defineStore('account', {
  state: (): {
    token: string;
    userId: string;
    username: string;
    nickName: string;
    tenantId: string;
    tenants: ListTenantItem[];
  } => ({
    token: '',
    userId: '',
    username: '',
    nickName: '',
    tenantId: '',
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
    },
    async logout() {
      await accountApi.logout();
      this.$reset();
    },
    async refreshTenants() {
      this.tenants = await accountApi.listTenants();
    },
    async triggerTenant(tenantId: string) {
      this.tenantId = tenantId;
    },
  },
});

export default useAccountStore;
