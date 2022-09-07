<template>
  <div>
    <BaseLayout>
      <template #header>
        <div class="describe">E-DOMS</div>
      </template>
      <RouterView />
    </BaseLayout>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LayoutView',
}
</script>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import BaseLayout from './BaseLayout.vue'
</script>

<style lang="scss" scoped>
.describe {
  height: 100%;
  margin: 0 41px;
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  color: #fff;
  display: flex;
  align-items: center;
}
</style>
