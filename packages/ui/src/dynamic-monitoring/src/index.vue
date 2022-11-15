<template>
  <div>
    <img :src="NoData" />
    <div>动环监测</div>
    <div>></div>
    <div>
      <div v-for="({ type, label }, index) in indicators" :key="index">
        <div>{{ type }}</div>
        <div>{{ label }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { MDynamicMonitoring } from '../../../src/types';
import useApp from '../../useApp';

import NoData from './assets/no_data.png';

const props = defineProps<{
  config: MDynamicMonitoring;
}>();

useApp(props);

const indicators = computed(() => props.config.indicators);
</script>
