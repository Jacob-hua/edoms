<template>
  <div :id="`${meta.id}`">
    <slot></slot>
    <EdomComponent v-for="item in meta.children" :key="item.id" :meta="item"></EdomComponent>
  </div>
</template>

<script lang="ts" setup name="edom-page">
import useApp from '../../useApp';
import EdomComponent from '../../component';
import { EdPage } from '@edoms/meta-model';

interface Props {
  meta: EdPage;
}

const props = defineProps<Props>();
useApp(props);
</script>
