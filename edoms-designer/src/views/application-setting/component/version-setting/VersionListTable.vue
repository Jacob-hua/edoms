<template>
  <el-table :data="tableData" :max-height="maxHeight">
    <el-table-column label="版本">
      <template #default="scope">
        <el-row>
          <el-col :span="12">
            <span class="version-name">{{ scope.row.name }} </span>
            <span v-if="scope.row.versionId === defaultVersionId" class="currentFlag">default</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <LongText :content="scope.row.description || ''" :content-style="{ textAlign: 'left' }"></LongText>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-row justify="end">
          <el-col :span="6">
            <el-button @click="handlePreview(scope.row)">预览</el-button>
          </el-col>
          <el-col :span="6">
            <el-button @click="handleEdit(scope.row)">修改</el-button>
          </el-col>
          <el-col :span="6">
            <el-button v-role="['manager']" @click="handleExport(scope.row)">
              导出<el-icon>
                <Download />
              </el-icon>
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button @click="handleDelete(scope.row)">
              删除<el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
  </el-table>

  <EditVersionDialog
    v-if="editVersionVisible"
    v-model:visible="editVersionVisible"
    :application-id="applicationId"
    :application-name="applicationName"
    :version-item="versionItem"
    @success="handleUpdateSuccess"
  >
  </EditVersionDialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Download } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import applicationApi from '@/api/application';
import type { ListVersionResItem } from '@/api/version';
import versionApi from '@/api/version';
import LongText from '@/components/LongText.vue';
import { MimeType } from '@/const/mime';
import useExport from '@/hooks/useExport';

import EditVersionDialog, { VersionItem } from './EditVersionDialog.vue';

const props = withDefaults(
  defineProps<{
    tableData: ListVersionResItem[];
    applicationName: string;
    applicationId: string;
    defaultVersionId: string;
    applicationAddress: string;
    maxHeight?: string | number;
  }>(),
  {
    maxHeight: () => 530,
  }
);

const emit = defineEmits<{
  (event: 'deleteSuccess'): void;
  (event: 'updateSuccess'): void;
}>();

const editVersionVisible = ref<boolean>(false);

const versionItem = reactive<VersionItem>({
  name: '',
  versionId: '',
  description: '',
});

const previewPath = import.meta.env.VITE_PREVIEW_PATH;

const handlePreview = (row: ListVersionResItem) => {
  const previewUrl = `${previewPath}${props.applicationAddress}/${row.versionId ?? ''}`;
  window.open(previewUrl);
};

const handleEdit = async (row: ListVersionResItem) => {
  const result = await versionApi.getVersion({ versionId: row.versionId });
  versionItem.name = result.name;
  versionItem.versionId = result.versionId;
  versionItem.description = result.description;
  editVersionVisible.value = true;
};

const handleExport = (row: ListVersionResItem) => {
  handleUseExport(row);
};

const { execute: handleUseExport } = useExport<ListVersionResItem>(
  async (row) =>
    await applicationApi.exportApplication({
      applicationId: props.applicationId,
      versionId: row?.versionId ?? '',
    }),
  (row) => `${props.applicationName}（${row?.name}）.zip`,
  MimeType.ZIP
);

const handleDelete = (row: ListVersionResItem) => {
  ElMessageBox.confirm(`是否删除${props.applicationName}-${row.name}版本？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await versionApi.deleteVersion({ versionIds: [row.versionId], applicationId: props.applicationId });
      ElMessage.success('删除成功');
      emit('deleteSuccess');
    })
    .catch(() => {});
};

const handleUpdateSuccess = () => {
  emit('updateSuccess');
};
</script>

<style lang="scss" scoped>
.version-name {
  font-size: 20px;
  font-weight: 500;
  padding-right: 10px;
}

.currentFlag {
  vertical-align: text-top;
  border: 1px solid #409eff;
  border-radius: 15px;
  padding: 2px 4px;
  font-size: 12px;
  background: #409eff;
  color: #fff;
}
</style>
