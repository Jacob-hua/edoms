<template>
  <div class="record-table-container">
    <div v-if="!hideCol" class="text-col" :style="{ width: longWidth }">
      <div>{{ title }}</div>
      <div v-for="text in textCols" :key="text">{{ text }}</div>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :cell-class-name="isLight ? highLightBody : ''"
      :header-cell-class-name="isLight ? highLightHeader : ''"
    >
      <template #empty>
        <el-empty :image-size="0" description="暂无数据"></el-empty>
      </template>
      <el-table-column
        v-for="col in tableCols"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label || col.name"
        :width="colWidth"
      />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
// import { dateFormat } from '@/utils/public.js'
// import i18n from '@/assets/language'
// import useApp from '../../../useApp'
// const { t } = useApp(props);

const props: any = defineProps({
  title: {
    required: true,
    type: String,
    default: '运行时间',
  },
  textCols: {
    required: true,
    type: Array as any,
    default: () => [],
  },
  tableCols: {
    required: true,
    type: Array as any,
    default: () => [],
  },
  tableData: {
    required: true,
    type: Array,
    default: () => [],
  },
  colWidth: {
    required: false,
    type: String,
    default: '',
  },
  // 不显示第一列
  hideCol: {
    type: Boolean,
    default: false,
  },
  longWidth: {
    type: String,
    default: '136px',
  },
  isLight: {
    type: Boolean,
    default: true,
  },
});

// 日期格式化
const dateFormat = (f: any, d: any) => {
  const date = d ? new Date(d) : new Date();
  let fmt = f || 'YYYY-MM-DD';
  let ret;
  const weekArr = ['日', '一', '二', '三', '四', '五', '六'];
  const opt: any = {
    'Y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'D+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString(), // 秒
    'W+': date.getDay(), // 星期    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    if (Object.prototype.hasOwnProperty.call(opt, k)) {
      ret = new RegExp(`(${k})`).exec(fmt);
      if (ret) {
        const temp = k === 'W+' ? weekArr[opt[k]] : opt[k];
        fmt = fmt.replace(ret[1], ret[1].length === 1 ? temp : opt[k].padStart(ret[1].length, '0'));
      }
    }
    // if (opt.hasOwnProperty(k)) {
    //   ret = new RegExp(`(${k})`).exec(fmt);
    //   if (ret) {
    //     const temp = k === 'W+' ? weekArr[opt[k]] : opt[k];
    //     fmt = fmt.replace(ret[1], ret[1].length === 1 ? temp : opt[k].padStart(ret[1].length, '0'));
    //   }
    // }
  }
  return fmt;
};

const curHour = dateFormat('HH', new Date());
const isPM = ref(false);

watch(
  () => props.tableCols,
  () => {
    if (props.tableCols.length && props.tableCols[0].label === '12:00') {
      isPM.value = true;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

const highLightBody = (parms: any) => {
  let target = parseInt(curHour, 10);
  if (isPM.value) {
    target -= 12;
  }
  if (parms.columnIndex < target) {
    return 'pre-data';
  }
  if (parms.columnIndex === target) {
    return 'cur-data';
  }
};
const highLightHeader = (parms: any) => {
  let target = parseInt(curHour, 10);
  if (isPM.value) {
    target -= 12;
  }
  if (parms.columnIndex === target) {
    return 'cur-header';
  }
};
</script>

<style lang="scss" scoped>
.record-table-container {
  display: flex;
  .text-col {
    width: 136px;
    display: flex;
    flex-direction: column;
    background-color: rgba($color: #1b9aff, $alpha: 0.3);
    border: 1px solid rgba($color: #fff, $alpha: 0.2);
    border-right: none;
    color: rgba(#fff, 0.8);
    font-size: 14px;
    & > div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(#fff, 0.2);
      }
    }
  }
  :deep(.el-table) {
    flex: 1;
    --el-table-border-color: rgba(255, 255, 255, 0.2);
    .el-table__empty-block {
      min-height: 104px;
    }
    .el-table__cell {
      padding: 0;
    }
    .el-table__header,
    .el-table__body .cell {
      height: 34px;
      line-height: 34px;
    }
    .pre-data {
      background-color: rgba(#ffffff, 0.06);
    }
    .cur-data {
      background-color: rgba(#1b9aff, 0.3);
    }
    .cur-header {
      background-color: #1b9aff;
    }
  }
  :deep(.el-table tr) {
    color: rgba(255, 255, 255, 0.8);
    background-color: #272d36;
  }

  :deep(.el-table th.el-table__cell) {
    color: #fffc;
    background-color: rgba(27, 154, 255, 0.2);
  }
}
</style>
