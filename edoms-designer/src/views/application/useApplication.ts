import { listApplications } from '@/api/application'
import { ref, type Ref } from 'vue'
import { GridViewMenu } from '@/components/type'
import { ApplicationInfo } from '@/api/application/type'
const splicingImageUrl = (data: Array<ApplicationInfo>): Array<ApplicationInfo & { imgUrl: string }> => {
  return data.map((app) => {
    return {
      imgUrl: `${import.meta.env.VITE_BASE_API}/file/download/?fileId=${app.thumbnailId}&isPreview=true`,
      ...app,
    }
  })
}
const concatApplications = async (listData: Ref<Array<ApplicationInfo>>) => {
  const { dataList } = await listApplications({
    page: 1,
    limit: 10,
  })
  listData.value = listData.value.concat(splicingImageUrl(dataList))
}
const loadMore = (data: any) => {
  concatApplications(data)
}
const add = () => {
  console.log('add')
}

export const useApplication = () => {
  const listData = ref<Array<ApplicationInfo>>([])
  const panelMenuList = ref<GridViewMenu[]>([
    {
      iconSize: 20,
      iconColor: '#000',
      icon: 'Operation',
      name: '发布应用',
      action: <ApplicationInfo>(currentData: ApplicationInfo) => {
        console.log(currentData)
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
  concatApplications(listData)
  return {
    panelMenuList,
    listData,
    loadMore,
    add,
  }
}
