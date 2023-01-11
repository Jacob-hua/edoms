<template>
  <div :class="['item', isActive ? 'active' : '']">
    <p class="pop-menu-content">
      <el-icon v-if="formModel.isHomePage" :size="20"><House /></el-icon>
      <LongText :content="formModel.name" :content-style="{ textAlign: 'left' }"></LongText>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

import type { ListPageResItem } from '@/api/page';
import LongText from '@/components/LongText.vue';

export interface ListPageItem extends ListPageResItem {
  /** 页面首页标识 */
  isHomePage?: boolean;
}

const props = defineProps<{
  applicationId: string;
  data: ListPageItem;
  isActive: boolean;
}>();

const formModel = reactive({
  ...props.data,
});
</script>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
}

.pop-menu-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.item {
  cursor: pointer;
  width: 100%;
  height: 45px;
  line-height: 45px;
  padding-left: 10px;
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
