import { listApplications } from '@/api/application'
import { reactive, ref, type Ref, isRef, isReactive, toRaw, watch } from 'vue'
import { GridViewMenu } from '@/components/type'
import { ApplicationInfo } from '@/api/application/type'
import { type Router } from 'vue-router'
import { useAppInfoStore } from '@/store/appInfo'
interface Page {
  page: number
  limit: number
}

const pageInfo = reactive<Page>({
  page: 0,
  limit: 16,
})

const listData = ref<Array<ApplicationInfo>>([])
const initData = ref<Array<ApplicationInfo>>([])
const visible = ref<boolean>(false)
const totals = ref<string>('')

const splicingImageUrl = (data: Array<ApplicationInfo>): Array<ApplicationInfo & { imgUrl: string }> => {
  return data.map((app) => {
    return {
      imgUrl: `${import.meta.env.VITE_BASE_API}/file/download/?fileId=${app.thumbnailId}&isPreview=true`,
      ...app,
    }
  })
}
const concatApplications = async (data: Ref<Array<ApplicationInfo>> | ApplicationInfo[], pageInfo: Page) => {
  pageInfo.page += 1
  const { dataList, count } = await listApplications(pageInfo)
  totals.value = count
  if (isRef(data)) {
    listData.value = data.value ? data.value.concat(splicingImageUrl(dataList)) : splicingImageUrl(dataList)
  }
  if (isReactive(data)) {
    listData.value = toRaw(data as any).concat(splicingImageUrl(dataList))
  }
}
const checkNoMore = (data: any): boolean => {
  return String(data.length) === totals.value
}

const loadMore = (data: any) => {
  if (checkNoMore(data)) {
    return
  }
  concatApplications(data, pageInfo)
}
const add = () => {
  visible.value = true
}
const operation = (data: ApplicationInfo) => {
  console.log(data)
}
const setting = ({ push }: Router, data: ApplicationInfo) => {
  push('/app-setting')
  useAppInfoStore().$patch({
    appInfo: data,
  })
}
const resetPageInfo = (pageInfo: Page) => {
  pageInfo.page = 0
  pageInfo.limit = 16
}
enum IconEnum {
  OPERATION = 'Operation',
  SETTING = 'Setting',
}

const PanelActionEffect: Record<string, Function> = {
  [IconEnum.OPERATION]: operation,
  [IconEnum.SETTING]: setting,
}
export const useApplication = (router: Router) => {
  const panelMenuList = ref<GridViewMenu<ApplicationInfo>[]>([
    {
      iconSize: 20,
      iconColor: '#000',
      icon: IconEnum.OPERATION,
      name: '发布应用',
      action: function (data) {
        PanelActionEffect[this.icon](router, data)
      },
    },
    {
      iconSize: 20,
      iconColor: '#000',
      icon: IconEnum.SETTING,
      name: '设置',
      action: function (data) {
        PanelActionEffect[this.icon](router, data)
      },
    },
  ])
  watch(
    () => useAppInfoStore().appInfo.thumbnailId,
    () => {
      resetPageInfo(pageInfo)
      concatApplications(ref<ApplicationInfo[]>([]), pageInfo)
    },
    {
      immediate: true,
      deep: true,
    }
  )
  return {
    panelMenuList,
    listData,
    pageInfo,
    loadMore,
    add,
    visible,
    initData,
    concatApplications,
  }
}
