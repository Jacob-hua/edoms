<template>
  <div class="table-container">
    <div class="top-wrapper">
      <div class="top-wrapper-left">
        <p class="name">{{ data.name }}</p>
        <p class="description"></p>
      </div>
      <div class="top-wrapper-right">
        <el-button type="danger" size="large" @click="handleClearTable">清空</el-button>
        <el-button ref="importBtn" :loading="selectFileLoading" size="large" type="primary" @click="handleFileChange"
          >导入</el-button
        >
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
        <el-table-column prop="fileName" label="文件名称">
          <template #default="scope">
            <span v-if="scope.row.fileName" class="file" @click="handleFileDownload(scope.row)">
              {{ scope.row.fileName }}
            </span>
            <span v-else> - </span>
          </template>
        </el-table-column>
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
import { nextTick, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import fileApi from '@/api/file';
import modelApi from '@/api/model';
import { MimeType } from '@/const/mime';
import useDate from '@/hooks/useDate';
import useExport from '@/hooks/useExport';
import useSelectFile from '@/hooks/useSelectFile';

const { formatTime } = useDate();

const { execute: selectFileExecute, loading: selectFileLoading } = useSelectFile();

const props = withDefaults(
  defineProps<{
    data: any;
  }>(),
  {
    data: () => ({}),
  }
);

const { execute, loading } = useExport(
  async () => {
    try {
      const result = await modelApi.exportTable({
        tableId: props.data.id,
      });
      loadTableHistory();
      return result;
    } catch (e) {
      return [];
    }
  },
  () => `${props.data.name}.csv`,
  MimeType.CSV
);

const { execute: handleExportRecord, loading: recordLoading } = useExport(
  async () => {
    const result = await modelApi.exportTableHistory({
      dicCimId: props.data.id,
    });
    loadTableHistory();
    return result;
  },
  () => `${props.data.name}的操作记录.xls`,
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
const importBtn = ref();
const loadTableHistory = async () => {
  const { dataList, count } = await modelApi.getTableHistory({
    page: pageInfo.value.page,
    limit: pageInfo.value.limit,
    tableId: props.data.id,
  });
  dataList.forEach((item) => {
    item.createTime = formatTime(item.createTime) as string;
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
  ElMessageBox.confirm('此操作将清空表数据, 是否继续?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await modelApi.clearTable({
        tableId: Number(props.data.id),
      });
      loadTableHistory();
      ElMessage.success('清空成功');
    })
    .catch(() => {});
};

const handleFileChange = async () => {
  ElMessageBox.confirm('应该为“此操作将覆盖表数据, 是否继续?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const file = (await selectFileExecute(['.csv']))?.[0]!;
      await modelApi.importTable({
        file,
        tableId: props.data.id!,
        fileName: file.name,
      });
      ElMessage.success('导入成功');
      importBtn?.value?.ref?.blur();
      loadTableHistory();
    })
    .catch(() => {
      nextTick(() => {
        importBtn?.value?.ref?.blur();
      });
    });
};

const handleFileDownload = (data: any) => {
  const { execute } = useExport(
    async () => {
      try {
        const result = await fileApi.downloadFile({
          contentId: data.contentId,
        });
        return result;
      } catch (e) {
        return [];
      }
    },
    () => `${data.fileName}`,
    MimeType.CSV
  );
  execute();
};
</script>

<style lang="scss" scoped>
.file {
  color: #409eff;
  cursor: pointer;
}
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
