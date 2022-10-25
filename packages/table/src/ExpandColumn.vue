<template>
  <ElTableColumn type="expand">
    <template #default="scope">
      <MTable
        v-if="config.table"
        :show-header="false"
        :columns="config.table"
        :data="(config.prop && scope.row[config.prop]) || []"
      ></MTable>
      <MForm
        v-if="config.form"
        :config="config.form"
        :init-values="config.values || (config.prop && scope.row[config.prop]) || {}"
      ></MForm>
    </template>
  </ElTableColumn>
</template>

<script lang="ts" setup>
import { ElTableColumn } from '@edoms/design';
import { MForm } from '@edoms/form';

import { ColumnConfig } from './schema';
import MTable from './Table.vue';

withDefaults(
  defineProps<{
    config: ColumnConfig;
  }>(),
  {
    config: () => ({}),
  }
);
</script>
