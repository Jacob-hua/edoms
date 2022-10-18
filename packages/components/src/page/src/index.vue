<template>
  <div :id="`${meta.id}`" class="edoms-ui-page" :style="style">
    <slot></slot>
    <EdomComponent v-for="item in meta.children" :key="item.id" :meta="item"></EdomComponent>
  </div>
</template>

<script lang="ts" setup name="edom-page">
import useApp from '../../useApp';
import EdomComponent from '../../component';
import { EdPage } from '@edoms/meta-model';
import { computed } from 'vue';

interface Props {
  meta: EdPage;
}

const props = defineProps<Props>();
const app = useApp(props);

const style = computed(() => app.transformStyle(props.meta.style ?? ''));
</script>
