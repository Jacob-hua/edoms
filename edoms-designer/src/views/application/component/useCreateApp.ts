import { computed, reactive, ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { AppForm } from '@/api/application/type'
import { createApplication } from '@/api/application'

export const useCreateApp = (
  visible: boolean,
  emit: {
    (event: 'update:visible', data: boolean): void
    (event: 'refreshList'): void
  }
) => {
  const formRef = ref<FormInstance>()

  const dynamicValidateForm = reactive<AppForm>({
    name: '',
    description: '',
    thumbnailId: '',
  })

  const appVisible = computed({
    get: () => visible,
    set: (value) => emit('update:visible', value),
  })

  const cancel = () => {
    appVisible.value = false
    formRef.value?.resetFields()
  }

  const submit = async () => {
    if (!formRef.value) return
    try {
      await formRef.value?.validate()
      // 提交表单操作
      const { applicationId } = await createApplication(dynamicValidateForm)
      if (applicationId) {
        ElMessage.success('创建成功')
        appVisible.value = false
        emit('refreshList')
      }
    } catch (e: any) {
      console.log(e.toString())
    }
  }
  return {
    formRef,
    dynamicValidateForm,
    appVisible,
    cancel,
    submit,
  }
}
