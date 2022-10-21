import { ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { AppForm } from '@/api/application/type'
import { updateApplication } from '@/api/application'
const formRef = ref<FormInstance>()
const updateApp = async ({ applicationId, name, description, thumbnailId, serviceAddress }: AppForm) => {
  const { errorInfo } = await updateApplication({
    applicationId,
    name,
    description,
    thumbnailId,
    serviceAddress,
  })
  if (errorInfo.errorCode) {
    ElMessage.error(errorInfo.errorMsg)
    return
  }
  ElMessage.success('更新成功')
}
export const useAppInfo = (emit: { (event: 'back'): void }) => {
  const update = async (appInfo: AppForm) => {
    if (!formRef.value) return
    try {
      await formRef.value?.validate()
      await updateApp(appInfo)
      emit('back')
    } catch (e: any) {
      console.log(e)
    }
  }
  return {
    formRef,
    update,
  }
}
