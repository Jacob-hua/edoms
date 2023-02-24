<template>
  <ElIcon v-if="!icon" class="edoms-editor-icon"><Edit></Edit></ElIcon>
  <ElIcon v-else-if="typeof icon === 'string' && icon.startsWith('http')" class="edoms-editor-icon"
    ><img :src="icon"
  /></ElIcon>
  <SvgIcon
    v-else-if="typeof icon === 'string'"
    class="el-icon edoms-editor-icon"
    :symbol-id="icon"
    color="#909090"
    active-color="#ffffff"
    size="40px"
  ></SvgIcon>
  <ElIcon v-else class="edoms-editor-icon"><component :is="toRaw(icon)"></component></ElIcon>
</template>

<script lang="ts" setup>
import { toRaw } from 'vue';
import { Edit } from '@element-plus/icons-vue';

import { ElIcon } from '@edoms/design';

import SvgIcon from './SvgIcon.vue';

defineProps<{
  icon?: any;
}>();
</script>
