<template>
  <el-card class="box-card">
    <template #header>
      <div class="clearfix">
        <span>{{ t('permission.participant') }}</span>
        <el-button type="primary" @click="handleAddPermission">{{ t('permission.add') }}</el-button>
      </div>
    </template>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column prop="username" :label="t('permission.nickname')" align="center" />
      <el-table-column prop="roleName" :label="t('permission.permission')" align="center" />
      <el-table-column :label="t('permission.operate')">
        <template #default="{ row }">
          <el-button v-if="row.isDisplay" size="small" type="danger" @click="handleDelete(row)">{{
            t('permission.delete')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @update:current-page="handleCurrentPageChange"
      />
    </div>
    <AddPersonDialog
      v-if="visible"
      v-model:visible="visible"
      :application-id="appInfo.applicationId"
      @submitted="handleSubmitted"
    ></AddPersonDialog>
  </el-card>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';

import { GetApplicationRes } from '@/api/application';
import PermissionApi, { Permission, PermissionListReq } from '@/api/permission';

import AddPersonDialog from './AddPersonDialog.vue';
const { t } = useI18n();
const props = defineProps<{
  appInfo: GetApplicationRes;
}>();

const total = ref<number>();
const tableData = ref<Permission[]>();
const visible = ref<boolean>(false);
const loading = ref<boolean>(false);
const queryParams = ref<PermissionListReq>({
  applicationId: props.appInfo?.applicationId,
  limit: 10,
  page: 1,
});

const getPermissionList = async (queryParams: Ref<PermissionListReq>) => {
  loading.value = true;
  try {
    const { dataList, count } = await PermissionApi.permissionList({ ...queryParams.value });
    total.value = +count;
    tableData.value = dataList ?? [];
  } catch (e: any) {
    loading.value = false;
    throw new Error(e);
  } finally {
    loading.value = false;
  }
};

watch(
  () => queryParams,
  (newQueryParams) => {
    getPermissionList(newQueryParams);
  },
  {
    immediate: true,
  }
);

const handleAddPermission = () => {
  visible.value = true;
};
const handleSubmitted = () => {
  getPermissionList(queryParams);
};
const handleDelete = async ({ userId }: Permission) => {
  ElMessageBox.confirm(t('permission.continue'), t('permission.tip'), {
    confirmButtonText: t('permission.confirm'),
    cancelButtonText: t('permission.cancel'),
    type: 'warning',
  })
    .then(async () => {
      await PermissionApi.permissionDelete({
        applicationId: props.appInfo.applicationId,
        userId,
      });
      ElMessage.success(t('permission.deleteSuccess'));
      getPermissionList(queryParams);
    })
    .catch(() => {});
};

const handleCurrentPageChange = (value: number) => {
  queryParams.value.page = value;
  getPermissionList(queryParams);
};
</script>

<style lang="scss" scoped>
.box-card {
  width: 80%;
  margin-left: 10%;
  .clearfix {
    display: flex;
    justify-content: space-between;
  }
  .pagination {
    float: right;
    margin: 40px;
  }
}
</style>
