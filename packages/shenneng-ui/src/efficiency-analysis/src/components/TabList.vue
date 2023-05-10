<template>
  <div v-if="props.list.length" class="tab-list">
    <div v-show="isShow" class="to-left icon-style" @click="handelrToScroll(-1)">{{ String('<') }}</div>
    <div class="tab-wrapper" :style="{ width: isShow ? '' : '100%', marginLeft: isShow ? '' : '0px' }">
      <div class="scroll-wrapper" :style="{ transform: `translateX(${-scrollDis}px)` }">
        <div v-for="itm in props.list" :key="itm.value" class="list-item">
          <div class="itm-key">
            <span class="count-font">{{ 1332.1 }}</span>
            <div class="count-unit">今日制热功率（kWh）</div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isShow" class="to-right icon-style" @click="handelrToScroll(1)">
      {{ String('>') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, onMounted, ref, watch, withDefaults } from 'vue';

const props = withDefaults(
  defineProps<{
    list: Array<{ [key: string]: any }>;
  }>(),
  {
    list: () => [],
  }
);

// const emits = defineEmits<{
//   (e: 'operate', itm: { [key: string]: any }): void;
// }>();

let domList: Array<Element> = [];

const currentIdx = ref<string | number>('0');
// 是否显示左右点击按钮
const isShow = ref<boolean>(false);
// 可以滚动dom总长度
const scrollWidth = ref<number>(0);
// 固定宽度
const perHasWidth = ref<number>(0);
// 已经滚动的距离
const scrollDis = ref<number>(0);
// 滚动index
const scrollIndex = ref<number>(0);
// 滚动临界index
const panIndex = ref<number>(0);
// 滚动第一个的差值
const distanceDes = ref<number>(0);

// const handlerToChange = (itm: { [key: string]: any }) => {
//   currentIdx.value = itm.value;
//   emits('operate', itm);
// };

const getDomRect = () => {
  const domPer = document.getElementsByClassName('tab-list')[0];
  const domFt = document.getElementsByClassName('tab-wrapper')[0];
  panIndex.value = 0;
  if (!domPer) return;
  domList = Array.from(domPer.getElementsByClassName('list-item'));
  const domPerRect = domPer.getBoundingClientRect();
  perHasWidth.value = domFt.getBoundingClientRect().width - 2 * 22 - 8;
  for (let i = 0; i < domList.length; i++) {
    const width = domList[i].getBoundingClientRect().width;
    scrollWidth.value += width;
    if (!panIndex.value && scrollWidth.value >= perHasWidth.value) {
      panIndex.value = i;
      distanceDes.value = scrollWidth.value - perHasWidth.value;
    }
  }
  // 判断是否具备滚动的条件
  isShow.value = scrollWidth.value > domPerRect.width;
  scrollIndex.value = 0;
};

const handelrToScroll = (idx: number) => {
  // 临界点左
  if (scrollIndex.value + panIndex.value + idx < panIndex.value) {
    scrollIndex.value = 0;
    return;
  } else if (scrollIndex.value + idx + panIndex.value > domList.length - 1) {
    scrollIndex.value = domList.length - panIndex.value - 1;
    return;
  } else {
    scrollIndex.value += idx;
  }
  if (idx > 0) {
    const dom = domList[scrollIndex.value + panIndex.value];
    let width = dom.getBoundingClientRect().width;
    if (scrollIndex.value === 1) {
      width += distanceDes.value;
    }
    scrollDis.value += width;
  } else {
    const dom = domList[scrollIndex.value + panIndex.value];
    let width = dom.getBoundingClientRect().width;
    if (scrollIndex.value === 0) {
      width += distanceDes.value;
    }
    scrollDis.value -= width;
  }
};

onBeforeMount(() => {
  currentIdx.value = props.list[0]?.value;
});

onMounted(() => {
  queueMicrotask(() => {
    getDomRect();
  });
});

watch(
  () => props.list,
  (newV: Array<{ [key: string]: string | number }>) => {
    currentIdx.value = newV[0]?.value;
    queueMicrotask(() => {
      getDomRect();
    });
  }
);
</script>

<style lang="scss" scoped>
.tab-list {
  width: 100%;
  height: 80px;
  margin: 10px 0;
  pointer-events: all;
  // background-color: antiquewhite;
  display: flex;
  justify-content: space-between;
  padding: 5px 0px;
  box-sizing: border-box;
  // border-top: 1px solid rgba(0, 163, 255, 0.3);
  // border-bottom: 1px solid rgba(0, 163, 255, 0.3);
  position: relative;
  .icon-style {
    width: 26px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: rgba(0, 163, 255, 0.1);
    position: absolute;
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    cursor: pointer;
    user-select: none;
    &.to-left {
      left: 0;
      top: 15px;
    }
    &.to-right {
      right: 0;
      top: 15px;
    }
  }
  .tab-wrapper {
    width: calc(100% - 22px - 22px - 8px);
    height: 80px;
    overflow: hidden;
    margin-left: 26px;
    .scroll-wrapper {
      width: auto;
      height: 100%;
      display: flex;
      flex-wrap: nowrap;
      .list-item {
        padding: 0 16px;
        box-sizing: border-box;
        height: 80px;
        // border-left: 1px solid rgba(0, 163, 255, 0.3);
        // &:last-child {
        //   border-right: 1px solid rgba(0, 163, 255, 0.3);
        // }
        .itm-key {
          width: 190px;
          height: 80px;
          // background-color: rgba(0, 163, 255, 0.1);
          background-image: url('../assets/tab-bg-st.png');
          background-size: 100% 100%;
          text-align: center;
          line-height: 44px;
          // margin: 0 auto;
          // cursor: pointer;
          // color: rgba(196, 229, 248, 1);
          // font-size: 14px;
          // box-sizing: border-box;
          .count-font {
            color: rgba(65, 228, 222, 1);
            font-size: 26px;
          }
          .count-unit {
            width: 100%;
            height: 20px;
            line-height: 20px;
            text-align: center;
            color: rgba(234, 245, 255, 1);
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
