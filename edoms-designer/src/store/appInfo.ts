import { defineStore } from 'pinia'
import { AppForm } from '@/api/application/type'

export const useAppInfoStore = defineStore('appInfo', {
  state: (): { appInfo: AppForm } => ({
    appInfo: {
      name: '',
      description: '',
      thumbnailId: '',
      serviceAddress: null,
    },
  }),
  actions: {},
})
