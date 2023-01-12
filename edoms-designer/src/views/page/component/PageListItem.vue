<template>
  <div :class="['item', isActive && 'active']">
    <p class="pop-menu-content">
      <LongText :content="data.name ?? ''" :content-style="{ textAlign: 'left' }"></LongText>
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { MPage } from '@edoms/schema';

import LongText from '@/components/LongText.vue';

defineProps<{
  data: MPage;
  isActive: boolean;
}>();
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
