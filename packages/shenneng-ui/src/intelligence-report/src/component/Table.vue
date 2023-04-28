<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-27 11:28:12
-->
<template>
  <div class="wrap-table">
    <div class="header">
      <img src="../assets/dialog_icon_report.png" alt="" class="icon-report" />
      <div class="label"></div>
      <div class="close"></div>
    </div>
    <div class="report">
      <el-form ref="basciFormRef" class="condition-form" label-width="75px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="">
              <el-date-picker />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
          <el-form-item label="项目类型" prop="proType">
            <el-select v-model="manangeForm.proType">
              <el-option
                v-for="item in proTypeOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col> -->
          <el-col :span="2">
            <el-button type="primary">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { ElForm } from '@edoms/design';

import { MEnergyMonitoring } from '../type';
defineProps<{
  config: MEnergyMonitoring;
}>();

const basciFormRef = ref(ElForm);
</script>

<style lang="scss" scoped>
.wrap-table {
  width: 100%;
  height: 100%;
  .header {
    position: relative;
    width: 100%;
    min-height: 52px;
    display: flex;
    align-items: center;
    .icon-report {
      width: 22px;
      height: 24px;
      margin-left: 21px;
      margin-right: 16px;
      background: url(../assets/dialog_icon_report.png);
      background-size: cover;
    }
    .label {
      color: #eaf5ff;
      font-size: 18px;
      font-weight: 400;
    }
    .close {
      position: absolute;
      right: 20px;
      top: 19px;
      width: 14px;
      height: 14px;
      cursor: pointer;
      background: url(../assets/icon_close.png);
      background-size: cover;
    }
  }
  .report {
    flex-grow: 1;
    background-color: red;
    width: 100%;
    .condition-form {
      height: 100%;
    }
  }
}
</style>
