<template>
  <ElTableColumn :label="config.label" :width="config.width" :fixed="config.fixed">
    <template #default="scope">
      <ElPopover
        v-if="config.popover"
        :placement="config.popover.placement"
        :width="config.popover.width"
        :trigger="config.popover.trigger"
      >
        <MTable
          v-if="config.popover.tableEmbed"
          :show-header="config.showHeader"
          :columns="config.table"
          :data="(config.prop && scope.row[config.prop]) || []"
        ></MTable>
        <template #reference>
          <ElButton text type="primary"> {{ config.text || formatter(config, scope.row) }}</ElButton>
        </template>
      </ElPopover>
    </template>
  </ElTableColumn>
</template>

<script lang="ts" setup>
import { ElButton, ElPopover, ElTableColumn } from '@edoms/design';

import { ColumnConfig } from './schema';
import MTable from './Table.vue';
import { formatter } from './utils';

withDefaults(
  defineProps<{
    config: ColumnConfig;
  }>(),
  {
    config: () => ({}),
  }
);
</script>
