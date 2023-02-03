<template>
  <component
    :id="config.id"
    :is="tagName"
    :class="`edoms-ui-component${config.className ? ` ${config.className}` : ''}`"
    :style="style"
    :config="config"
  ></component>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, provide } from 'vue';

import Core from '@edoms/core';
import { MNode } from '@edoms/schema';
import { toLine } from '@edoms/utils';

const props = defineProps<{
  config: MNode;
}>();

const app = inject<Core | undefined>('app');

const tagName = computed(() => `edoms-ui-${toLine(props.config.type)}`);

const style = computed(() => app?.transformStyle(props.config.style ?? ''));

const vm = getCurrentInstance()?.proxy;
provide('hoc', vm);
</script>
