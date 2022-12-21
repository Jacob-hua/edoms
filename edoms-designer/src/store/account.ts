import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';

import type { ListTenantItem, LoginReq } from '@/api/account';
import accountApi from '@/api/account';

const router = useRouter();

const useAccountStore = defineStore('account', {
  state: (): {
    token: string;
    userId: string;
    username: string;
    nickName: string;
    currentTenant: ListTenantItem | undefined;
    tenants: ListTenantItem[];
  } => ({
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
