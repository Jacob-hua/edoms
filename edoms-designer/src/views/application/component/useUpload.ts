import { ref } from 'vue'
import { ElMessage, UploadFile, UploadFiles } from 'element-plus'
import { fileUpload } from '@/api/application'
import { AppForm } from '@/api/application/type'

export const useUpload = (dynamicValidateForm: AppForm) => {
  const dialogImageUrl = ref<string>('')
  const dialogVisible = ref<boolean>(false)
  const disabled = ref<boolean>(false)
  const accept = ref<string>('.png, .jpg, .jpeg, .gif, .webp, .PNG, .JPG, .GIF, .WEBP')
  const fileList = ref<UploadFiles>([])

  const checkImageUploadLimit = (uploadFiles: UploadFiles): boolean => {
    if (uploadFiles.length > 1) {
      ElMessage.error('缩略图只能上传一张图片')
      uploadFiles.splice(-1, 1)
      return false
    }
    return true
  }

  const upload = async (uploadFile: UploadFile) => {
    const formData = new FormData()
    formData.set('file', uploadFile.raw!)
    formData.set('fileType', uploadFile.raw?.type!)
    formData.set('fileName', uploadFile.name)
    const { contentId } = await fileUpload(formData)
    dynamicValidateForm.thumbnailId = contentId!
  }
  const imgChange = (uploadFile: UploadFile, uploadFiles: UploadFiles): void => {
    // 校验文件上传个数限制
    if (checkImageUploadLimit(uploadFiles)) {
      // 执行上传操作
      upload(uploadFile)
    }
  }
  const handleRemove = (file: UploadFile) => {
    fileList.value.splice(
      fileList.value.findIndex(({ uid }) => uid === file.uid),
      1
    )
    dynamicValidateForm.thumbnailId = null
  }

  const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!
    dialogVisible.value = true
  }
  return {
    dialogImageUrl,
    dialogVisible,
    disabled,
    accept,
    fileList,
    imgChange,
    handleRemove,
    handlePictureCardPreview,
  }
}
