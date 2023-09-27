<template>
  <div class="tab-scroll">
    <div class="left-arrow" @click="left">
      <el-icon><CaretLeft /></el-icon>
    </div>
    <el-carousel
      v-if="list.length"
      ref="carouselTab"
      arrow="never"
      :loop="false"
      :initial-index="0"
      indicator-position="none"
      :autoplay="false"
      height="24px"
      :class="{ 'no-bg': noBg }"
    >
      <el-carousel-item v-for="(item, index) in defineArr" :key="index">
        <div
          v-for="(single, idx) in item"
          :key="idx"
          class="carousel-name"
          :class="{
            active: curCode == single.index,
          }"
          @click="tabChange(single.index)"
        >
          {{ single.name }}
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="right-arrow" @click="right">
      <el-icon><CaretRight /></el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  curCode: {
    type: Number as any,
    default: 0,
  },
  count: {
    type: Number,
    default: 3,
  },
  noBg: {
    type: Boolean,
    default: false,
  },
});
const defineArr: any = ref([]);
const carouselTab = ref();
const GroupCout = (val: any) => {
  // 获取数据
  const objArray = val;
  // 拿到数组的长度
  const len = objArray.length;
  // 自定义每页显示多少个数据-假设每行显示3个
  const lineNum = len % props.count === 0 ? len / props.count : Math.floor(len / props.count + 1);
  const res = [];
  // 处理
  for (let i = 0; i < lineNum; i++) {
    const temp = objArray.slice(i * props.count, i * props.count + props.count);
    res.push(JSON.parse(JSON.stringify(temp)));
  }
  defineArr.value = res;
};
watch(
  () => props.list,
  (val) => {
    GroupCout(val);
  },
  {
    deep: true,
    immediate: true,
  }
);
const emit = defineEmits(['tabChange']);
const tabChange = (item: any) => {
  emit('tabChange', item);
};
const left = () => {
  carouselTab.value.prev();
};
const right = () => {
  carouselTab.value.next();
};
</script>

<style lang="scss" scoped>
.tab-scroll {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin: 0px 20px 22px 20px;
  cursor: pointer;
  .el-icon {
    font-size: 18px;
    color: #a6a6a6;
    margin-top: 2px;
  }
  .el-carousel {
    width: 100%;
    .el-carousel__container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .el-carousel__item {
        // width: 342px;
        margin: 0px auto;
        display: flex;
        background: rgba(#fff, 0.08);
        flex: 1;
        > div {
          flex: 1;
          height: 24px;
          line-height: 24px;
          color: rgba(#fff, 0.45);
          text-align: center;
        }
        .carousel-name {
          font-size: 12px;
        }
        .active {
          color: #1b9aff;
        }
      }
    }
  }
  .no-bg .el-carousel__item {
    background: rgba(#fff, 0) !important;
    .carousel-name {
      line-height: 24px;
      font-size: 14px !important;
    }
  }
}
</style>
