<template>
  <div class="wrapper">
    <div class="img">
      <img src="../assets/chargeStation.png" alt="" />
    </div>
    <div class="info">
      <div>
        <span>设备名称：</span>
        <span>{{ config.option.name }}</span>
      </div>
      <div>
        <span>开关状态：</span>
        <div class="mb-2 flex items-center text-sm">
          <el-radio-group :key="radioNum" v-model="config.option.switch" class="ml-4">
            <el-radio style="margin-right: 20px" label="1" size="small">开</el-radio>
            <el-radio label="0" size="small">关</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div v-if="config.option.state === 'normal'">
        <span>当前充电：</span>
        <div>
          <span style="width: 44px; display: inline-block; height: 13px; background: #2fda2f"></span
          ><span
            style="width: 23px; height: 13px; display: inline-block; background: #68696a; margin-right: 10px"
          ></span
          >{{ config.option.charging }}%
        </div>
      </div>
      <div v-if="config.option.state !== 'normal'">
        <span>当前状态：</span>
        <div :class="config.option.class">{{ config.option.state }}</div>
      </div>
      <div>
        <span>剩余时间：</span>
        <span style="font-size: 12px; font-family: Microsoft YaHei; font-weight: 400; color: #2fda2f">{{
          config.option.remainder
        }}</span>
      </div>
    </div>
    <div class="select">
      <el-checkbox
        v-model="config.option.checked"
        :value-key="config.option.id"
        label=""
        size="large"
        @change="checkedChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
const radioNum = ref(-1);
const config = defineProps<{
  option: {
    id: number;
    name: string;
    switch: string;
    state: string;
    charging: string;
    remainder: string;
    checked: boolean;
    class: string;
  };
}>();
const { option } = toRefs(config);
console.log(option);

const checkedChange = () => {
  console.log(option);
};
radioNum.value = Math.random();
</script>

<style lang="scss" scoped>
:deep(.el-radio.el-radio--large) {
  height: 27px !important;
  margin-right: 20px !important;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  border-color: #2fda2f;
  background-color: #2fda2f;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  border-color: #00a3ff;
  background-color: #00a3ff;
}

:deep(.el-checkbox.el-checkbox--large .el-checkbox__inner) {
  border-color: #00a3ff;
  background-color: #090f17;
}

.red {
  color: #ff0000;
}

.green {
  color: #2dd1c0;
}

.yellow {
  color: #d1b02d;
}

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
  }

  .info > div {
    line-height: 27px;
    display: flex;
  }
}
</style>
