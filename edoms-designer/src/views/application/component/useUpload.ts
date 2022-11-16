import { type Ref, isRef, ref } from 'vue';
import { ElMessage, UploadFile, UploadFiles } from 'element-plus';

import { AppForm } from '@/api/application/type';
import { fileUpload } from '@/api/file';
interface UploadParameter {
  fileLimit: number;
  fileSize: number;
}
interface CheckParameter {
  uploadFile: UploadFile;
  uploadFiles: UploadFiles;
  deleteCount: number;
}
export const useUpload = (
  dynamicValidateForm: AppForm | Ref<AppForm>,
  files: { url: string; uid?: string }[] = [],
  { fileLimit, fileSize }: UploadParameter = { fileLimit: 1, fileSize: 100 },
  acceptType = '.png, .jpg, .jpeg, .gif, .webp, .PNG, .JPG, .JPEG .GIF, .WEBP'
) => {
  const { length } = files;
  const dialogImageUrl = ref<string>('');
  const dialogVisible = ref<boolean>(false);
  const disabled = ref<boolean>(false);
  const accept = ref<string>(acceptType);
  const fileList = length ? ref(files) : ref<UploadFiles>([]);
  const checkImageUploadLimitAndFileSize = (
    uploadFile: UploadFile,
    uploadFiles: UploadFiles,
    deleteCount = 1
  ): boolean => {
    return (
      checkFileLimit({ uploadFile, uploadFiles, deleteCount }) &&
      checkFileSize({ uploadFile, uploadFiles, fileSize, deleteCount })
    );
  };
  const deleteFile = ({ uploadFile, uploadFiles, deleteCount }: CheckParameter) => {
    uploadFiles.splice(
      uploadFiles.findIndex(({ uid }) => uid === uploadFile.uid),
      deleteCount
    );
  };
  const checkFileSize = ({
    uploadFile,
    uploadFiles,
    fileSize,
    deleteCount,
  }: CheckParameter & Pick<UploadParameter, 'fileSize'>): boolean => {
    if (uploadFile.size! > fileSize * 1024 * 1024) {
      ElMessage.warning(`上传图片大于${fileSize}MB,请重新上传`);
      deleteFile({
        uploadFile,
        uploadFiles,
        deleteCount,
      });
      return false;
    }
    return true;
  };
  const checkFileLimit = ({ uploadFile, uploadFiles, deleteCount }: CheckParameter): boolean => {
    if (uploadFiles.length > fileLimit) {
      ElMessage.warning(`缩略图只能上传${fileLimit}张图片`);
      deleteFile({
        uploadFile,
        uploadFiles,
        deleteCount,
      });
      return false;
    }
    return true;
  };
  // TODO  上传upload 提成 回调
  const upload = async (uploadFile: UploadFile) => {
    const formData = new FormData();
    formData.set('file', uploadFile.raw!);
    formData.set('fileType', uploadFile.raw?.type!);
    formData.set('fileName', uploadFile.name);
    const { contentId } = await fileUpload(formData);
    if (isRef(dynamicValidateForm)) {
      dynamicValidateForm.value.thumbnailId = contentId!;
      return;
    }
    dynamicValidateForm.thumbnailId = contentId!;
  };
  const imgChange = (uploadFile: UploadFile, uploadFiles: UploadFiles): void => {
    // 校验文件上传个数限制
    if (checkImageUploadLimitAndFileSize(uploadFile, uploadFiles)) {
      // 执行上传操作
      upload(uploadFile);
    }
  };
  const handleRemove = (file: UploadFile, deleteCount = 1) => {
    fileList.value.splice(
      fileList.value.findIndex(({ uid }) => uid === file.uid),
      deleteCount
    );
    if (isRef(dynamicValidateForm)) {
      dynamicValidateForm.value.thumbnailId = null;
      return;
    }
    dynamicValidateForm.thumbnailId = null;
  };

  const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!;
    dialogVisible.value = true;
  };
  return {
    dialogImageUrl,
    dialogVisible,
    disabled,
    accept,
    fileList,
    imgChange,
    handleRemove,
    handlePictureCardPreview,
  };
};
