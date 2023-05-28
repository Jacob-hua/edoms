<template>
  <div class="wrapper">
    <div class="img">
      <img src="../assets/chargeStation.png" alt="" />
    </div>
    <div class="info">
      <div>
        <span>设备名称：</span>
        <span>{{ cardData.option.value.name }}</span>
      </div>
      <div>
        <span>开关状态：</span>
        <div class="mb-2 flex items-center text-sm">
          <el-radio-group v-model="cardData.option.value.switch" class="ml-4">
            <el-radio label="1" size="large">开</el-radio>
            <el-radio label="0" size="large">关</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div>
        <span>当前状态：</span>
        <div></div>
      </div>
      <div>
        <span>剩余时间：</span>
        <span style="font-size: 12px; font-family: Microsoft YaHei; font-weight: 400; color: #2fda2f">{{
          cardData.option.value.remainder
        }}</span>
      </div>
    </div>
    <div class="select">
      <el-checkbox v-model="cardData.option.value.select" label="" size="large" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
const config = defineProps<{
  option: any;
}>();
const cardData = toRefs(config);
</script>

<style lang="scss" scoped>
.wrapper {
  width: 270px;
  height: 150px;
  background: rgba(9, 15, 23, 0.3);
  border: 1px solid #212c3c;
  display: flex;

  .img {
    img {
      margin: 20px;
    }
  }

  .info {
    width: 60%;
    display: grid;
    margin: 20px 0px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #eaf5ff;

    div {
      line-height: 27px;
    }
  }
}
</style>
