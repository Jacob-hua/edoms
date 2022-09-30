import { listApplications } from '@/api/application'
import { reactive, ref, type Ref, isRef, isReactive, toRaw } from 'vue'
import { GridViewMenu } from '@/components/type'
import { ApplicationInfo } from '@/api/application/type'

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
const panelMenuList = ref<GridViewMenu<ApplicationInfo>[]>([
  {
    iconSize: 20,
    iconColor: '#000',
    icon: 'Operation',
    name: '发布应用',
    action: (data) => {
      console.log(data)
      return '123'
    },
  },
  {
    iconSize: 20,
    iconColor: '#000',
    icon: 'Operation',
    name: '设置',
    action: () => {
      console.log('设置')
    },
  },
])
const totals = ref<string>('')

const splicingImageUrl = (data: Array<ApplicationInfo>): Array<ApplicationInfo & { imgUrl: string }> => {
  return data.map((app) => {
    return {
      imgUrl: `${import.meta.env.VITE_BASE_API}/file/download/?fileId=${app.thumbnailId}&isPreview=true`,
      ...app,
    }
  })
}
const concatApplications = async (data: Ref<Array<ApplicationInfo>>, pageInfo: Page) => {
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
export const useApplication = () => {
  concatApplications(listData, pageInfo)
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
