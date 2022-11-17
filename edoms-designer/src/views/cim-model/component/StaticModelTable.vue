<template>
  <div class="table-container">
    <div class="top-wrapper">
      <div class="top-wrapper-left">
        <p class="name">{{ data.name }}</p>
        <p class="description"></p>
      </div>
      <div class="top-wrapper-right">
        <el-button type="danger" size="large" @click="handleClearTable">清空</el-button>
        <el-upload
          class="upload-demo"
          :auto-upload="false"
          :limit="1"
          :show-file-list="false"
          :on-change="handleFileChange"
        >
          <el-button size="large" type="primary">导入</el-button>
        </el-upload>
        <el-button :loading="loading" type="primary" size="large" @click="execute">导出</el-button>
      </div>
    </div>
    <div class="table">
      <div class="table-top">
        <div class="table-text">操作记录</div>
        <el-button :loading="recordLoading" type="primary" size="large" @click="handleExportRecord"
          >导出操作记录</el-button
        >
      </div>
      <el-table :data="historyData" border>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="action" label="操作"></el-table-column>
        <el-table-column prop="createBy" label="操作人"></el-table-column>
        <el-table-column prop="fileName" label="文件名称"></el-table-column>
        <el-table-column prop="createTime" label="操作时间"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="pageInfo.page"
          :page-size="pageInfo.limit"
          :total="pageInfo.total"
          background
          layout="prev, pager, next, jumper"
          @current-change="onPageChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="StaticModelTable">
import { ref, watch } from 'vue';
import { ElMessage, UploadFile } from 'element-plus';

import { clearTable, exportOperationRecord, exportTable, getTableHistory, importFile } from '@/api/model';
import { MimeType } from '@/const/mime';
import useDate from '@/hooks/useDate';
import useExport from '@/hooks/useExport';

const { formatTime } = useDate();

const props = withDefaults(
  defineProps<{
    data: any;
  }>(),
  {
    data: () => {},
  }
);

const { execute, loading } = useExport(
  async () => {
    try {
      const result = await exportTable({
        tableId: props.data.id,
      });
      return result;
    } catch (e) {
      return [];
    }
  },
  'cim_device_gather.csv',
  MimeType.CSV
);

const { execute: handleExportRecord, loading: recordLoading } = useExport(
  async () => {
    const result = await exportOperationRecord({
      dicCimId: props.data.id,
    });
    return result;
  },
  '操作记录.excel',
  MimeType.EXCEL
);
const historyData = ref<any>([]);

watch(
  () => props.data,
  () => {
    loadTableHistory();
  },
  {
    immediate: false,
  }
);
const pageInfo = ref({
  page: 1,
  limit: 10,
  total: 0,
});
const loadTableHistory = async () => {
  const { dataList, count } = await getTableHistory({
    page: 1,
    limit: 10,
    tableId: props.data.id,
  });
  dataList.forEach((item) => {
    item.createTime = formatTime(item.createTime);
  });
  pageInfo.value.total = Number(count);
  historyData.value = dataList;
};
loadTableHistory();
const onPageChange = (value: number) => {
  pageInfo.value.page = value;
  loadTableHistory();
};

const handleClearTable = async () => {
  await clearTable({
    tableId: Number(props.data.id),
  });
  ElMessage.success('清空成功');
};

const handleFileChange = async (uploadFile: UploadFile) => {
  const formData = new FormData();
  formData.set('file', uploadFile.raw!);
  formData.set('tableId', props.data.id!);
  formData.set('fileName', uploadFile.name);
  await importFile(formData);
  ElMessage.success('导入成功');
  loadTableHistory();
};
</script>

<style lang="scss" scoped>
.table-container {
  .top-wrapper-right {
    display: flex;
    margin-top: 40px;
    .el-button {
      margin-left: 10px;
    }
  }
  padding: 0 60px;
  .table {
    margin-top: 60px;
    .table-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      .table-text {
        font-size: 24px;
        font-weight: 600;
      }
    }
  }

  .top-wrapper {
    display: flex;
    justify-content: space-between;
    .top-wrapper-left {
      .name {
        font-size: 24px;
        font-weight: 600;
      }
    }
  }
  .pagination {
    float: right;
    margin-top: 40px;
  }
}
</style>
