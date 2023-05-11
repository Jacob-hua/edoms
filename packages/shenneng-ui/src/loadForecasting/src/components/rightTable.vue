<template>
  <div class="right-table-list">
    <div class="table-col-title" :style="{ width: props.tableTitleList[0]?.width }">
      <div
        v-for="itm in props.tableTitleList"
        :key="itm.value"
        class="col-item"
        :style="{ width: itm.width, height: `${100 / props.tableTitleList.length}%` }"
      >
        {{ itm.key }}
      </div>
    </div>
    <div class="table-content-list" :style="{ width: `calc(100%-${props.tableTitleList[0]?.width})` }">
      <div class="scroll-wrapper">
        <div v-for="(itm, index) in props.tableData" :key="index" class="content-col" :style="getStyle(itm)">
          <div
            v-for="col in props.tableTitleList"
            :key="col.value"
            class="col-item"
            :style="{
              width: col.width,
              height: `${100 / props.tableTitleList.length}%`,
              background: col.backgroundColor,
            }"
          >
            {{ itm[col.value] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, withDefaults } from 'vue';

const props = withDefaults(
  defineProps<{
    // leftColTitleList: Array<{ [key: string]: string }>;
    tableTitleList: Array<{ [key: string]: string }>;
    tableData: Array<{ [key: string]: string | number }>;
    currentDate: number;
  }>(),
  {
    tableTitleList: () => [
      { key: '运行时间', value: 'date', width: '85px', backgroundColor: 'rgba(17, 22, 30, 0.8)' },
      { key: '预测值', value: 'forSeeValue', width: '85px', backgroundColor: '' },
      { key: '实际值', value: 'realValue', width: '85px', backgroundColor: '' },
    ],
    tableData: () => [
      { date: '00:00', forSeeValue: '20', realValue: '22' },
      { date: '01:00', forSeeValue: '21', realValue: '22' },
      { date: '02:00', forSeeValue: '22', realValue: '23' },
      { date: '03:00', forSeeValue: '23', realValue: '24' },
      { date: '04:00', forSeeValue: '24', realValue: '25' },
      { date: '05:00', forSeeValue: '25', realValue: '26' },
      { date: '06:00', forSeeValue: '26', realValue: '27' },
      { date: '07:00', forSeeValue: '27', realValue: '28' },
      { date: '08:00', forSeeValue: '28', realValue: '29' },
      { date: '09:00', forSeeValue: '29', realValue: '30' },
      { date: '10:00', forSeeValue: '30', realValue: '31' },
      { date: '11:00', forSeeValue: '31', realValue: '32' },
    ],
    currentDate: 10,
  }
);

const getStyle = computed(() => ({ date }: { [key: string]: string | number }) => {
  const time = String(props.currentDate);
  if (String(date).indexOf(time) > -1) return { backgroundColor: 'rgba(17, 22, 30, 1)' };
  return {};
});

onMounted(() => {});

onUnmounted(() => {});
</script>

<style lang="scss" scoped>
.right-table-list {
  width: 100%;
  height: 100%;
  display: flex;
  user-select: none;
  .table-col-title {
    height: 100%;
    background-color: rgba(17, 22, 30, 1);
    border-right: 1px solid rgba(17, 22, 30, 1);
    box-sizing: border-box;
    .col-item {
      width: 100%;
      text-align: center;
      line-height: 100%;
      color: rgba(199, 199, 199, 1);
      font-size: 14px;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      border-bottom: 1px solid rgba(29, 38, 52, 1);
      box-sizing: border-box;
    }
  }
  .table-content-list {
    height: 100%;
    overflow: hidden;
    overflow-x: auto;
    // flex-direction: column;
    .scroll-wrapper {
      width: auto;
      height: 100%;
      display: flex;
      .content-col {
        width: auto;
        height: 100%;
        border-right: 1px solid rgba(17, 22, 30, 1);
        box-sizing: border-box;
        .col-item {
          width: 100%;
          text-align: center;
          line-height: 100%;
          color: rgba(199, 199, 199, 1);
          font-size: 14px;
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: center;
          border-bottom: 1px solid rgba(29, 38, 52, 1);
          box-sizing: border-box;
        }
      }
    }
  }
  .table-content-list::-webkit-scrollbar {
    width: 1px;
    height: 5px;
  }

  .table-content-list::-webkit-scrollbar-thumb {
    border-radius: 5px;
    // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 1);
  }

  .table-content-list::-webkit-scrollbar-track {
    // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background: transparent;
  }
}
</style>
