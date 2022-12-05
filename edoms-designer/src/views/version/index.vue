<template>
  <div class="version-container">
    <section class="left-section">
      <div class="header-top" @click="goBack">
        <el-icon class="header-icon" :size="23"><ArrowLeft /></el-icon>
        <span>历史版本</span>
      </div>
      <div>
        <GridList
          ref="gridList"
          class="grid-list"
          column-gap="20px"
          :page-size="99999999"
          item-min-width="200px"
          :request="loadData"
        >
          <template #default="{ item }">
            <div :class="['item', item.versionId === active.versionId ? 'active' : '']" @click="handleActive(item)">
              <p class="icon-wrapper">
                <span v-show="item.isShowText">{{ item.name }}</span>
                <el-input v-show="!item.isShowText" v-model="item.name"></el-input>
                <span>
                  <el-icon v-show="item.isShowText" :size="20" @click="showInput(item)"><EditPen /></el-icon>
                  <el-icon v-show="item.isShowText" :size="20" @click="handleDelete(item)"><Delete /></el-icon>
                  <el-icon v-show="!item.isShowText" :size="22" @click="handleHideInput(item)"><Check /></el-icon>
                </span>
              </p>
              <p>{{ formatTime(item.createTime) }}</p>
              <p>{{ item.createBy }}</p>
            </div>
          </template>
          <template #noMore>
            <div></div>
          </template>
        </GridList>
      </div>
    </section>
    <div class="version-right">
      <div class="top-bar">
        <el-button type="primary" size="large" @click="handleApply">应用此版本</el-button>
        <el-button type="primary" size="large" @click="goEdit">编辑</el-button>
      </div>
      <div class="wrapper">
        <DSLPreview
          v-if="previewVisible"
          height="100%"
          :application-id="applicationId"
          :content-id="active.pushContentId"
          :page-id="active.pageId"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

import versionApi from '@/api/version';
import DSLPreview from '@/components/DSLPreview.vue';
import GridList from '@/components/GridList.vue';
import useDate from '@/hooks/useDate';

const { formatTime } = useDate();

const route = useRoute();

const router = useRouter();

const gridList = ref();

const active = ref();

const previewVisible = ref(false);

const applicationId = computed(() => route.query.applicationId as string);

const loadData = async ({ pageSize, current }: { pageSize: number; current: number }) => {
  const { dataList } = await versionApi.listVersions({
    page: current,
    limit: pageSize,
    pageId: Number(route.query.pageId),
  });
  active.value = dataList[0];
  dataList.forEach((data: any) => {
    data.isShowText = true;
  });
  if (dataList.length) {
    previewVisible.value = true;
  }
  return {
    data: dataList,
    total: dataList.length,
  };
};

const goBack = () => {
  router.go(-1);
};

const showInput = (model: any) => {
  model.isShowText = false;
};

const handleHideInput = async (model: any) => {
  model.isShowText = true;
  await versionApi.updateVersion({
    versionId: model.versionId,
    name: model.name,
    pageId: Number(route.query.pageId),
  });
  ElMessage.success('更新成功');
  gridList.value?.reload();
};

const handleDelete = async (model: any) => {
  ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await versionApi.deleteVersion({
        versionIds: [model.versionId],
      });
      ElMessage.success('删除成功');
      gridList.value?.reload();
    })
    .catch(() => {});
};

const handleActive = (model: any) => {
  active.value = model;
};

const handleApply = async () => {
  await versionApi.recoveryVersion({
    versionId: active.value.versionId,
  });
  ElMessage.success('应用版本成功');
  router.push({
    path: '/page',
    query: {
      applicationId: applicationId.value,
    },
  });
};

const goEdit = () => {
  router.push({
    path: '/editor',
  });
};
</script>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
}
.wrapper {
  height: calc(100% - 75px);
}
.version-container {
  .item {
    cursor: pointer;
    width: 100%;
    height: 100px;
    padding-left: 10px;
    line-height: unset !important;
    display: block !important;
    border-bottom: 1px solid #e1e1e1;
    p {
      width: 100%;
      margin-bottom: 10px;
    }
    .icon-wrapper {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        .el-icon {
          margin-right: 10px;
        }
      }
    }
  }
  display: flex;
  .grid-list {
    margin-top: 10px;
    height: calc(100vh - 180px);
    overflow-y: auto;
    div {
      text-align: left;
    }
  }
  .left-section {
    border-right: 1px solid #e1e1e1;
    width: 20%;
    height: calc(100vh - 60px);
    .header-top {
      padding: 15px 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e1e1e1;
      .header-icon {
        cursor: pointer;
      }
      span {
        font-size: 20px;
        margin-left: 20px;
      }
    }
    .top-search {
      div {
        cursor: pointer;
      }
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .version-right {
    width: 80%;
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 15px;
      padding-top: 15px;
    }
  }
}
</style>
