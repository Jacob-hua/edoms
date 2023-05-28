<template>
  <div class="wrapper">
    <div class="icon">
      <div class="icon-img"><img :src="config.option.icon" alt="" /></div>
      <div style="margin-top: 10px">{{ config.option.title }}</div>
    </div>
    <div class="num">
      <div class="icon-img">
        <span class="tex">{{ config.option.num }}</span
        >台
      </div>
      <div style="margin-top: 10px">数量</div>
    </div>
    <div class="params">
      <div class="icon-img">
        <span class="tex">{{ config.option.params }}</span
        >kWh
      </div>
      <div style="margin-top: 10px">参数</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const config = defineProps<{
  option: any;
}>();
console.log(config.option);
</script>

<style lang="scss" scoped>
.wrapper {
  width: 270px;
  height: 80px;
  background: #141c27;
  border-radius: 4px;
  display: grid;
  grid-template-columns: repeat(3, 33.3%);

  .tex {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #ffffff;
    margin-right: 5px;
  }

  // background-image: url('../assets/');
  .icon {
    margin: auto;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 300;
    color: #ffffff;
    text-align: center;
  }

  .num {
    margin: auto;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 300;
    color: #ffffff;
    text-align: center;
  }

  .params {
    margin: auto;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 300;
    color: #ffffff;
    text-align: center;
  }
}
</style>
