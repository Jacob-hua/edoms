<template>
  <ElIcon v-if="!icon" class="edoms-editor-icon"><Edit></Edit></ElIcon>
  <ElIcon v-else-if="typeof icon === 'string' && icon.startsWith('http')" class="edoms-editor-icon"
    ><img :src="icon"
  /></ElIcon>
  <i v-else-if="typeof icon === 'string'" class="edoms-editor-icon" :class="icon"></i>
  <ElIcon v-else class="edoms-editor-icon"><component :is="toRaw(icon)"></component></ElIcon>
</template>

<script lang="ts" setup>
import { toRaw } from 'vue';
import { Edit } from '@element-plus/icons-vue';

import { ElIcon } from '@edoms/design';

defineProps<{
  icon?: any;
}>();
</script>
