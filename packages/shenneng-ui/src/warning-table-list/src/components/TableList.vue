<template>
  <div v-show="props.tableTitleList.length" class="table-list">
    <div v-for="(tbItm, idx) in state.tableDataList" :key="idx" class="table-item-list">
      <div
        v-for="titleItm in props.tableTitleList"
        :key="titleItm.value"
        :style="{ width: `${titleItm.width}%` }"
        class="col-item"
      >
        <div v-if="titleItm.value === 'warningCode'" class="status-st" :style="getStyle(tbItm)">
          {{ getValue(tbItm[titleItm.value]) }}
        </div>
        <span v-else>{{ tbItm[titleItm.value] }}</span>
      </div>
      <div class="operation">
        <div v-show="!tbItm.isCol" class="left" @click="handlerToCol(true, idx)"></div>
        <div v-show="tbItm.isCol" class="right" @click="handlerToCol(false, idx)"></div>
        <!-- el-icon-caret-bottom -->
        <!-- el-icon-caret-top -->
      </div>
      <div v-show="tbItm.isCol" class="details">
        <div class="content">{{ tbItm.warningContent }}</div>
        <div class="btn-group">
          <div class="left-confirm" @click="handlerToComfirm(tbItm)">确认</div>
          <div class="right-cancel" @click="handlerToCancel(tbItm)">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, onBeforeMount, reactive, withDefaults } from 'vue';

const allWarningList: any[] = [];

const props = withDefaults(
  defineProps<{
    tableTitleList: Array<{ [key: string]: string | number }>;
    // tableData: Array<{ [key: string]: string | number }>;
    warningTypeList: Array<{ [key: string]: string | number }>;
  }>(),
  {
    tableTitleList: () => [],
    tableData: () => [],
    warningTypeList: () => [],
  }
);

const state = reactive<{
  tableDataList: Array<{ [key: string]: string | number | boolean }>;
}>({
  tableDataList: [
    {
      warningCode: 'gz',
      warningContent: '系统内制冷剂不足，节流阀开。系统内制冷剂不足，节流阀开。',
      warningTime: '02-15 16:31',
    },
    { warningCode: 'yz', warningContent: '系统内制冷剂不足，节流阀开。', warningTime: '02-15 16:31' },
  ],
});

const getStyle = computed(() => (_itm: { [key: string]: any }) => {
  let color = null;
  color = allWarningList.filter((itm: any) => itm.warningCode === _itm.warningCode)[0]?.color;
  return {
    color,
    // backgroundColor: color,
    border: `1px solid ${color}`,
  };
});

const getValue = computed(() => (_itm: any) => {
  const value = allWarningList.filter((itm: any) => itm.warningCode === _itm)[0]?.warningName;
  return value;
});

const handlerToCol = (bol: boolean, idx: number) => {
  state.tableDataList[idx].isCol = bol;
};

const handlerToComfirm = (itm: { [key: string]: string | number | boolean }) => {
  console.log('确认', itm);
};

const handlerToCancel = (itm: { [key: string]: string | number | boolean }) => {
  itm.isCol = false;
};

const changeType = (itm: { [key: string]: any }) => {
  console.log('接口调用', itm);
};

onBeforeMount(() => {
  props.warningTypeList.forEach((itm: { [key: string]: any }) => {
    allWarningList.push(...itm.thresholdConfigs);
  });
  // state.tableDataList = [...props.tableData];
});

defineExpose({
  changeType,
});
</script>

<style lang="scss" scoped>
.table-list {
  width: 100%;
  height: 260px;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  .table-item-list {
    width: 100%;
    // height: 52px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border-bottom: 1px solid rgba(0, 163, 255, 0.14);
    box-sizing: border-box;
    padding: 0 10px;
    .col-item {
      height: 52px;
      line-height: 52px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .status-st {
        height: 24px;
        line-height: 24px;
        margin-top: 14px;
        color: rgba(215, 40, 36, 1);
        border: 1px solid rgba(215, 40, 36, 1);
        border-radius: 3px;
        // background-color: rgba(215, 40, 36, 0.2);
        box-sizing: border-box;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        text-align: center;
      }
    }
    .operation {
      width: 5%;
      height: 52px;
      line-height: 52px;
      color: rgb(12, 137, 209);
      cursor: pointer;
      .left {
        width: 100%;
        height: 100%;
        background-image: url('../assets/to-col.png');
        background-size: 12px 7px;
        background-repeat: no-repeat;
        background-position: center center;
      }
      .right {
        background-image: url('../assets/to-not-col.png');
        background-size: 12px 7px;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
        background-position: center center;
      }
    }
    .details {
      width: 100%;
      height: 100px;
      .content {
        color: rgba(196, 229, 248, 1);
        font-family: MicrosoftYaHei;
        font-size: 12px;
        line-height: 15px;
      }
      .btn-group {
        width: 32%;
        margin-left: 68%;
        display: flex;
        justify-content: space-between;
        margin-top: 45px;
        .left-confirm {
          width: 60px;
          height: 24px;
          background-color: rgba(17, 115, 236, 0.2);
          border: 1px solid rgba(17, 115, 236, 1);
          text-align: center;
          line-height: 24px;
          color: rgba(196, 229, 248, 1);
          font-family: MicrosoftYaHei;
          font-size: 12px;
          cursor: pointer;
        }
        .right-cancel {
          width: 60px;
          height: 24px;
          background-color: rgba(0, 163, 255, 0.1);
          border: 1px solid rgba(8, 49, 73, 1);
          text-align: center;
          line-height: 24px;
          color: rgba(204, 204, 204, 1);
          font-family: MicrosoftYaHei;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
.table-list::-webkit-scrollbar {
  width: 3px;
  height: 1px;
}

.table-list::-webkit-scrollbar-thumb {
  border-radius: 3px;
  // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
  background: rgba(4, 70, 108, 1);
}

.table-list::-webkit-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  background: transparent;
}
</style>
