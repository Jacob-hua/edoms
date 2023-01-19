import { defineStore, StoreDefinition } from 'pinia';

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
      return this.permissionList.includes(permissionKey);
    },
  },
}) as PermissionStore;

export default usePermissionStore;
