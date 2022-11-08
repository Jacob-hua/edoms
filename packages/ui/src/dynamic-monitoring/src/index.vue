<template>
  <h1>动环监测</h1>
</template>

<script lang="ts" setup>
import { MText } from '../../../src/types';
import useApp from '../../useApp';

const props = defineProps<{
  config: MText;
}>();

useApp(props);
</script>
