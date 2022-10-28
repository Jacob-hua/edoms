<template>
  <div>
    <BaseLayout>
      <RouterView />
    </BaseLayout>
  </div>
</template>

<script lang="ts">
export default {
  name: 'EditorLayout',
};
</script>

<script lang="ts" setup>
import BaseLayout from './BaseLayout.vue';
</script>
