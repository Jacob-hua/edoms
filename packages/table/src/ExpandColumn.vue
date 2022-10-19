<template>
  <el-table-column type="expand">
    <template #default="scope">
      <m-table
        v-if="config.table"
        :show-header="false"
        :columns="config.table"
        :data="scope.row[config.prop]"
      ></m-table>
      <MForm
        v-if="config.form"
        :config="config.form"
        :init-values="config.values || scope.row[config.prop] || {}"
      ></MForm>
    </template>
  </el-table-column>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { MForm } from '@tmagic/form';

import { ColumnConfig } from './schema';

export default defineComponent({
  components: { MForm },
  expose: [],
  props: {
    config: {
      type: Object as PropType<ColumnConfig>,
      default: () => ({}),
      required: true,
    },
  },
});
</script>
