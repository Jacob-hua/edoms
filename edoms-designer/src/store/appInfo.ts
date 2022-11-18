import { defineStore } from 'pinia';

import { CreateApplicationReq } from '@/api/application/type';

export const useAppInfoStore = defineStore('appInfo', {
  state: (): { appInfo: CreateApplicationReq } => ({
    appInfo: {
      name: '',
      description: '',
      thumbnailId: '',
    },
  }),
  actions: {},
});
