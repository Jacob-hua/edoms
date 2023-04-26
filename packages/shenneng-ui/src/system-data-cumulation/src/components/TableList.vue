<template>
  <div v-show="props.tableTitleList.length" class="table-list">
    <div v-for="(tbItm, idx) in state.tableDataList" :key="idx" class="table-item-list">
      <div class="left-ft"></div>
      <div class="right-content">
        <div
          v-for="titleItm in props.tableTitleList"
          :key="titleItm.value"
          :style="{ width: `${titleItm.width}%` }"
          class="col-item"
        >
          <span v-if="titleItm.key !== '日环比' && titleItm.value !== 'value'">{{ tbItm[titleItm.value] }}</span>
          <span v-if="titleItm.value === 'value'"
            ><span class="font-value">{{ tbItm[titleItm.value] }}</span
            ><span class="font-unit">{{ tbItm.unit }}</span></span
          >
          <div v-if="titleItm.key === '日环比'" class="operation">
            <span class="title-name">{{ titleItm.key }}</span>
            <span class="value-ft" :style="{ color: getColor(tbItm.isUp as number) }">{{ tbItm[titleItm.value] }}</span>
            <div class="value-icon">
              <span v-if="tbItm.isUp === 0">--</span>
              <span v-else-if="tbItm.isUp === 1" class="down-icon"></span>
              <span v-else class="up-icon"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive, withDefaults } from 'vue';

const props = withDefaults(
  defineProps<{
    tableTitleList: Array<{ [key: string]: string | number }>;
  }>(),
  {
    tableTitleList: () => [],
  }
);

const state = reactive<{
  tableDataList: Array<{ [key: string]: string | number | boolean }>;
}>({
  tableDataList: [
    { name: '总量', value: 128, ratio: '124', unit: 'kWh', isUp: 0 },
    { name: '系统内制冷剂总量', value: '11110', ratio: '8', unit: 't', isUp: 1 },
    { name: '系统内制冷剂总量', value: '596', ratio: '3', unit: 't', isUp: 2 },
    { name: '系统内制冷剂总量', value: '24555', ratio: '5', unit: 'kWh', isUp: 1 },
  ],
});

const getColor = computed(() => (isUp: number) => {
  if (isUp === 0) return 'rgba(196, 229, 248, 1)';
  if (isUp === 1) return 'rgba(53, 168, 99, 1)';
  if (isUp === 2) return 'rgba(215, 40, 36, 1)';
});

// const getIcon = computed(() => (isUp: number) => {
//   if (isUp === 0) return '---';
//   if (isUp === 1) return 'rgba(53, 168, 99, 1)';
//   if (isUp === 2) return 'rgba(215, 40, 36, 1)';
// });

const changeType = (itm: { [key: string]: any }) => {
  console.log('接口调用', itm);
};

onBeforeMount(() => {});

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
    // border-bottom: 1px solid rgba(0, 163, 255, 0.14);
    box-sizing: border-box;
    // padding: 0 10px;
    margin-bottom: 10px;
    .left-ft {
      width: 10px;
      height: 40px;
      background-image: url('../assets/table-left-icon.png');
      background-size: 100% 100%;
    }
    .right-content {
      width: calc(100% - 16px);
      background-color: rgba(0, 163, 255, 0.06);
      display: flex;
      justify-content: space-between;
      padding: 0 19px;
      box-sizing: border-box;
      .col-item {
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        display: flex;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: rgba(196, 229, 248, 1);
        font-size: 14px;
        font-family: MicrosoftYaHei;
        .font-value {
          color: rgba(0, 255, 240, 1);
          margin-right: 5px;
        }
        .font-unit {
          color: rgba(196, 229, 248, 1);
        }
        .operation {
          display: flex;
          .value-ft {
            padding: 0 5px;
            font-size: 15px;
          }
          .value-icon {
            width: 15px;
            height: 40px;
            .down-icon {
              margin-top: 14px;
              width: 15px;
              height: 12px;
              background-image: url('../assets/desc-icon.png');
              background-size: 100% 100%;
              display: block;
            }
            .up-icon {
              margin-top: 14px;
              width: 15px;
              height: 12px;
              background-image: url('../assets/add-icon.png');
              background-size: 100% 100%;
              display: block;
            }
          }
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
