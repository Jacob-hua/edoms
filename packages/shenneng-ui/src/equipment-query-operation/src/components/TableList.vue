<template>
  <div v-if="state.dataList.equipmentList" class="table-list">
    <div class="content-wrapper">
      <div class="left-content">
        <div
          v-for="(itm, idx) in state.dataList.equipmentList"
          :key="idx"
          :class="['itm-tab', ctIndex === idx ? 'active' : '']"
          @click="handkerToChange(idx)"
        >
          {{ itm.eqName }}
        </div>
      </div>
      <div class="right-content">
        <div
          v-for="(eq, idx) in state.dataList.equipmentList[ctIndex]
            ? state.dataList.equipmentList[ctIndex].pointList
            : []"
          :key="idx"
          class="itm-content"
        >
          <div class="top-ft">
            <span class="font" :style="{ color: eq.color }">{{ eq.data }}</span>
            <span class="unit">{{ eq.unit }}</span>
          </div>
          <div class="bottom-name">{{ eq.queryName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

import { QueryList } from '../type';

const emit = defineEmits<{
  (event: 'ctIndex', val: number): void;
}>();
const ctIndex = ref<number>(0);

const state = reactive<{
  dataList: { [key: string]: any };
}>({
  dataList: {},
});
const changeType = (itm: { [key: string]: string | number | Array<QueryList> }, val: number) => {
  state.dataList = itm;
  ctIndex.value = val;
};

const handkerToChange = (idx: number) => {
  if (idx === ctIndex.value) return;
  ctIndex.value = idx;
  emit('ctIndex', ctIndex.value);
};

defineExpose({
  changeType,
});
</script>

<style lang="scss" scoped>
.table-list {
  width: 100%;
  height: calc(100% - 54px);
  overflow: hidden;
  overflow-y: auto;
  position: relative;

  .content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;

    .left-content {
      width: 22%;
      height: 100%;
      overflow: hidden;
      border-right: 1px solid rgba(0, 163, 255, 0.1);
      overflow-y: auto;

      .itm-tab {
        width: 90%;
        height: 22px;
        background-image: url('../assets/tab-def.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-top: 20px;
        text-align: center;
        line-height: 22px;
        font-size: 12px;
        color: rgba(196, 229, 248, 1);
        cursor: pointer;

        &.active {
          color: #fff;
          background-image: url('../assets/tab-act.png');
        }
      }
    }

    .left-content::-webkit-scrollbar {
      width: 3px;
      height: 1px;
    }

    .left-content::-webkit-scrollbar-thumb {
      border-radius: 3px;
      // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
      background: rgba(4, 70, 108, 1);
    }

    .left-content::-webkit-scrollbar-track {
      // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      background: transparent;
    }

    .right-content {
      width: 78%;
      padding-left: 2%;
      padding-top: 10px;
      box-sizing: border-box;
      display: flex;
      // justify-content: space-between;
      flex-wrap: wrap;

      .itm-content {
        width: 30%;
        height: 62px;
        margin-left: 3.333%;
        margin-top: 10px;
        background-color: rgba(0, 163, 255, 0.06);
        box-sizing: border-box;
        text-align: center;

        .top-ft {
          height: 20px;
          vertical-align: bottom;
          margin-top: 10px;

          .font {
            color: rgba(0, 255, 240, 1);
            font-size: 20px;
            font-family: MicrosoftYaHei;
            margin-right: 5px;
          }

          .unit {
            color: rgba(196, 229, 248, 1);
            font-size: 16px;
            font-family: MicrosoftYaHei;
          }
        }

        .bottom-name {
          margin-top: 10px;
          color: rgba(196, 229, 248, 1);
          font-size: 12px;
          font-family: MicrosoftYaHei;
        }
      }
    }
  }
}
</style>
