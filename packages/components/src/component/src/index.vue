<template>
  <component
    v-if="display"
    :id="meta.id"
    :is="tagName"
    :class="`edoms-ui-component ${meta.className ? `${meta.className}` : ''}`"
    :meta="meta"
    :style="style"
  ></component>
</template>

<script lang="ts" setup name="edom-component">
import { Engine } from '@edoms/engine';
import { EdMeta } from '@edoms/meta-model';
import { computed, inject, reactive } from 'vue';

interface Props {
  meta: EdMeta;
}
const props = defineProps<Props>();

const meta: EdMeta = reactive(props.meta);

const tagName = computed(() => `edom-${meta.type}`);

const app: Engine | undefined = inject('app');

const style = computed(() => {
  if (meta.style) {
    return app?.transformStyle(meta.style);
  }
  return '';
});

const display = computed(() => {
  return meta.display !== false;
});
</script>
