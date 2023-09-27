<template>
  <div class="data-comp" :class="isWrap ? 'wrap-box' : ''">
    <div v-for="(item, index) in list" :key="index" class="single" :class="list.length == 4 && !isWrap ? 'isFour' : ''">
      <div v-if="item.icon" class="icon-box">
        <i class="iconfont" :class="item.icon"></i>
      </div>
      <div class="value-box text-overflow">
        <span class="val">{{ setVal(item.value, item.name) }}</span
        ><span class="unit" :class="!item.icon ? 'icon-color' : 'is-block'">{{ item.unit ? item.unit : '℃' }}</span>
      </div>
      <div class="name-box" :class="{ fontBold: item.icon }">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  list: {
    type: Array as any,
    default: () => [],
  },
  isWrap: {
    type: Boolean,
    default: false,
  },
});

const setVal = (val: any, name: string) => {
  if ((name === '电费' || name === '制冷成本') && String(val).includes('.')) {
    return Number(val).toFixed(2);
  }
  if (
    (name.includes('台数') || name.includes('制冷量') || name.includes('次数') || name.includes('用电量')) &&
    val !== '-'
  ) {
    return Number(val).toFixed(0);
  }
  if (String(val).includes('.')) {
    return Number(val).toFixed(1);
  }
  return val;
};
</script>

<style lang="scss" scoped>
.data-comp {
  display: flex;
  // justify-content: space-around;
  .single {
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgba(#fff, 0.65);
    font-size: 14px;
    margin-bottom: 15px;
    text-align: center;
    .icon-box {
      i {
        font-size: 26px;
        color: #1b9aff;
      }
    }
    .value-box {
      // color: #00ff00;
      margin: 8px 0 4px;
      font-weight: bold;
      width: 100%;
      text-align: center;
      .icon-color {
        color: rgba(#fff, 0.65);
        font-weight: normal;
        margin-left: 4px;
      }
      .val {
        font-size: 16px;
        font-family: Source Han Sans SC VF;
        font-weight: bold;
        color: #00ff00;
      }
      .unit {
        color: rgba(#fff, 0.65);
        font-weight: normal;
        font-size: 14px;
      }
      .is-block {
        display: block;
        margin-top: 5px;
      }
    }
    .fontBold {
      font-weight: bold;
    }
  }
  .isFour {
    width: 25%;
  }
}
.wrap-box {
  flex-wrap: wrap;
  height: 150px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
}
</style>
