<template>
  <div class="preview-wrapper">
    <DSLPreview v-if="contentId" height="100%" :content-id="contentId" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import applicationApi from '@/api/application';
import DSLPreview from '@/components/DSLPreview.vue';

const route = useRoute();

const router = useRouter();

const contentId = ref<string>();
watch(
  () => route.params.address as string,
  async (address: string) => {
    try {
      contentId.value = await applicationApi.getReleaseId({ serviceAddress: address });
      if (!contentId.value) {
        router.push({
          path: '/404',
        });
      }
    } catch (error) {
      router.push({
        path: '/404',
      });
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.preview-wrapper {
  height: 100%;
}
</style>
