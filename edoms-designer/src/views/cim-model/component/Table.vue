<template>
  <div class="g-edit-table">
    <!-- 定义添加按钮在表格上方 -->
    <slot name="top"></slot>
    <div class="table-main">
      <el-table :key="tableKey" v-bind="attrs" :data="tableData" v-on="listeners">
        <el-table-column v-for="({ colAttr, component }, index) in columns" v-bind="colAttr" :key="index">
          <template v-if="!colAttr?.type" #default="{ row }">
            <span v-if="row.readOnly && ignore.includes(component?.name)"> {{ row[colAttr?.prop] }}</span>
            <template v-else>
              <component
                v-model="row[colAttr.prop]"
                :is="component.name"
                :disabled="!row.isEdit"
                v-bind="component.compProps"
              >
                <template v-if="component.child">
                  <component
                    v-for="{ label, value } in component?.child?.options()"
                    :key="value"
                    :is="component.child.name"
                    :label="label"
                    :value="value"
                  ></component>
                </template>
              </component>
            </template>
          </template>
        </el-table-column>
        <el-table-column :fixed="fixed" label="操作">
          <template #default="scope">
            <slot name="operate" :operate="scope"></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 定义添加按钮在表格下方 -->
    <div class="bottom">
      <slot name="bottom"></slot>
    </div>
    <div v-if="request" class="pagination">
      <el-pagination
        :current-page="pageInfo.page"
        :page-size="pageInfo.limit"
        background
        layout="prev, pager, next, jumper"
        :total="pageInfo.total"
        @current-change="onPageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs, useAttrs } from 'vue';

const props = withDefaults(
  defineProps<{
    request?: Function;
    pageInfo?: { page: number; limit: number; total: number };
    ignore?: any[];
    columns: any[];
    data?: any[];
    fixed?: true | 'left' | 'right';
  }>(),
  {
    data: () => [],
    ignore: () => [undefined],
    request: undefined,
    pageInfo: () => ({
      page: 1,
      limit: 10,
      total: 0,
    }),
    fixed: undefined,
  }
);
const tableKey = ref(Math.random());
const attrs: Record<string, any> = useAttrs();
const listeners = Object.keys(attrs).reduce((listener: Record<string, Function>, key: string) => {
  if (typeof attrs[key] === typeof Function) {
    listener[key] = attrs[key];
  }
  return listener;
}, {});
const { data: tableData, columns } = toRefs(props);
const showTable = ref<boolean>(true);
const init = async () => {
  const result = await Promise.resolve(props.request?.(props.pageInfo));
  tableData.value.length = 0;
  tableData.value.push(...result);
  tableKey.value = Math.random();
};
onMounted(() => {
  props.request && init();
});
const onPageChange = (value: number) => {
  props.pageInfo.page = value;
  init();
};
defineExpose({
  showTable,
});
</script>

<style lang="scss" scoped>
.pagination {
  float: right;
  margin-top: 40px;
}
</style>
