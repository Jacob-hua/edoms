<template>
  <el-popover v-model:visible="visible" trigger="click" width="350px">
    <template #reference>
      <slot :version="version">
        <el-input
          class="reference-input"
          :value="version?.name"
          clearable
          :placeholder="t('page.请选择版本')"
          :suffix-icon="ArrowDown"
        ></el-input>
      </slot>
    </template>
    <div class="wrapper">
      <div class="header">
        <span class="title">{{ title ?? t('page.版本选择') }}</span>
        <el-icon class="close" :size="20" @click="handleClose"><Close /></el-icon>
      </div>
      <el-input v-model="versionName" clearable :placeholder="t('page.请输入版本名称')"></el-input>
      <div class="content">
        <GridList
          v-if="visible"
          ref="gridListRef"
          class="grid-list"
          :page-size="10"
          :request="loadData"
          @on-select-change="handleSelectChange"
        >
          <template #default="{ item }: { item: VersionModel }">
            <div :class="['grid-list-item', item.versionId === modelValue?.versionId && 'is-active']">
              {{ item.name }}
            </div>
          </template>
          <template #noMore>
            <div></div>
          </template>
        </GridList>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowDown } from '@element-plus/icons-vue';

import versionApi from '@/api/version';
import GridList, { RequestFunc } from '@/components/GridList.vue';

export interface VersionModel {
  versionId: string;
  name: string;
  contentId: string;
}
const { t } = useI18n();

const props = defineProps<{
  applicationId: string;
  modelValue?: VersionModel;
  title?: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: VersionModel): void;
  (event: 'onChange', value: VersionModel): void;
}>();

const visible = ref<boolean>(false);

const version = ref<VersionModel>();

const versionName = ref<string>();

const versionList = ref<VersionModel[]>([]);

const gridListRef = ref();

watch(
  () => versionName.value,
  () => {
    gridListRef.value?.reload();
  }
);

watch(
  () => props.modelValue,
  () => {
    version.value = props.modelValue;
  },
  { immediate: true }
);

const loadData: RequestFunc<VersionModel> = async ({ pageSize, current }) => {
  const { dataList, count } = await versionApi.listVersions({
    applicationId: props.applicationId,
    page: current,
    limit: pageSize,
    name: versionName.value,
  });

  versionList.value = dataList;
  return {
    data: dataList,
    total: count,
  };
};

function handleClose() {
  visible.value = false;
}

function handleSelectChange(item: VersionModel) {
  emit('update:modelValue', item);
  version.value = item;
  emit('onChange', item);
  handleClose();
}
</script>

<style lang="scss" scoped>
.reference-input :deep(.el-input__inner) {
  cursor: pointer;
}

.wrapper {
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 8px;
  font-weight: 600;
  line-height: 1;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e1e1e1;

  .title {
    flex-grow: 1;
    text-align: center;
  }

  .close {
    width: 30px;
    cursor: pointer;
  }
}

.content {
  margin-top: 8px;
  max-height: 215px;
  overflow-y: auto;

  .grid-list {
    max-height: 215px;
    min-height: 20px;
  }

  .grid-list-item {
    text-align: left;
    padding: 0 1px;
    font-size: 16px;
    word-break: break-all;
    padding: 8px 40px;
    cursor: pointer;

    &:hover {
      background-color: #bbb;
    }
  }

  .is-active {
    background: url('../../../assets/img/checkmark.png') no-repeat 14px center;
  }
}
</style>
