<template>
  <div>参数曲线</div>
</template>

<script lang="ts" setup>
import { MRunningParameters } from './type';

defineProps<{
  config: MRunningParameters;
}>();
</script>
