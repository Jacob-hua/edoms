<template>
  <ElTableColumn
    show-overflow-tooltip
    :label="config.label"
    :width="config.width"
    :fixed="config.fixed"
    :sortable="config.sortable"
    :prop="config.prop"
  >
    <template #default="scope">
      <ElForm v-if="config.type && editState[scope.$index]" label-width="0" :model="editState[scope.$index]">
        <m-form-container
          :prop="config.prop"
          :rules="config.rules"
          :config="config"
          :name="config.prop"
          :model="editState[scope.$index]"
        ></m-form-container>
      </ElForm>

      <ElButton
        v-else-if="config.action === 'actionLink' && config.prop"
        text
        type="primary"
        @click="config.handler?.(scope.row)"
      >
        <span v-html="formatter(config, scope.row)"></span>
      </ElButton>

      <a v-else-if="config.action === 'img' && config.prop" target="_blank" :href="scope.row[config.prop]"
        ><img :src="scope.row[config.prop]" height="50"
      /></a>

      <a
        v-else-if="config.action === 'link' && config.prop"
        target="_blank"
        :href="scope.row[config.prop]"
        class="keep-all"
        >{{ scope.row[config.prop] }}</a
      >

      <el-tooltip v-else-if="config.action === 'tip'" placement="left">
        <template #content>
          <div>{{ formatter(config, scope.row) }}</div>
        </template>
        <ElButton text type="primary">扩展配置</ElButton>
      </el-tooltip>

      <ElTag
        v-else-if="config.action === 'tag' && config.prop"
        :type="typeof config.type === 'function' ? config.type(scope.row[config.prop], scope.row) : config.type"
        close-transition
        >{{ formatter(config, scope.row) }}</ElTag
      >
      <div v-else v-html="formatter(config, scope.row)"></div>
    </template>
  </ElTableColumn>
</template>

<script lang="ts" setup>
import { ElButton, ElForm, ElTableColumn, ElTag } from '@edoms/design';

import { ColumnConfig } from './schema';
import { formatter } from './utils';

withDefaults(
  defineProps<{
    config: ColumnConfig;
    editState?: any;
  }>(),
  {
    config: () => ({}),
    editState: () => ({}),
  }
);
</script>
