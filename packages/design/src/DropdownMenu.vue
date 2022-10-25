<template>
  <component :is="uiComponent.component" v-bind="uiProps">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { getConfig } from './config';

const uiComponent = getConfig('components').dropdownMenu;

const uiProps = computed(() => uiComponent.props());
</script>
