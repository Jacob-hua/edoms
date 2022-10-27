import { ref } from 'vue';
import { LocationQueryValue, RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { ElMessage } from 'element-plus';

import { getAppInfo } from '@/api/application';
import { ApplicationInfo } from '@/api/application/type';

const appInfoVisible = ref<boolean>(false);
const appInfo = ref<ApplicationInfo>({
  applicationId: '',
  createBy: '',
  createTime: '',
  description: '',
  name: '',
  serviceAddress: '',
  tenantId: '',
  thumbnailId: '',
});
const getAppDetail = async (applicationId: LocationQueryValue | LocationQueryValue[]) => {
  const { result, errorInfo } = await getAppInfo({ applicationId } as { applicationId: string });
  if (errorInfo.errorCode) {
    ElMessage.error(errorInfo.errorMsg);
    return;
  }
  appInfoVisible.value = true;
  appInfo.value = result;
};
export const useSetting = ({ go }: Router, { query }: RouteLocationNormalizedLoaded) => {
  getAppDetail(query.applicationId);
  const goBack = () => {
    go(-1);
  };
  return {
    goBack,
    appInfo,
    appInfoVisible,
  };
};
