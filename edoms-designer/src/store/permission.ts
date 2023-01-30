import { defineStore, StoreDefinition } from 'pinia';

import { ALL_PERMISSION } from '@/const/permission';
export interface PermissionState {
  permissionList: string[];
}

export interface PermissionAction {
  refreshPermissionList: (permissionList: string[]) => void;
  hasPermission: (permissionKey: string) => boolean;
}

export interface PermissionGetters {
  getPermissionList: (state: PermissionState) => string[];
}

type PermissionStore = StoreDefinition<string, PermissionState, PermissionGetters, PermissionAction>;
const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    permissionList: [],
  }),
  persist: true,
  actions: {
    refreshPermissionList(permissionList: string[]) {
      this.permissionList = permissionList;
    },
    hasPermission(permissionKey: string) {
      if (this.permissionList.includes(ALL_PERMISSION)) {
        return true;
      }
      return this.permissionList.includes(permissionKey);
    },
  },
}) as PermissionStore;

export default usePermissionStore;
