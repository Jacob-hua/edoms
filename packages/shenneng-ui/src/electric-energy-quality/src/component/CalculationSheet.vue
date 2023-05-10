<template>
  <div class="wrapper_left_last">
    <div class="balance">本月结算</div>
    <div class="th_index">
      <div style="margin-bottom: 40px">
        <p><span style="color: #41e4de; font-size: 20px">-5372</span>元</p>
        <p>奖惩电费</p>
      </div>
      <div style="margin-bottom: 40px">
        <p><span style="color: #41e4de; font-size: 20px">0.98</span></p>
        <p>平均功率因素</p>
      </div>
      <div>
        <p><span style="color: #d72824; font-size: 20px">0.59</span></p>
        <p>最小功率因素</p>
      </div>
    </div>
    <div class="alculation_sheet">
      <div class="alculation_tie">
        <img class="alculation_icon" src="../../assets/icon.png" />
        <span>计算书</span>
      </div>
      <div class="alculation_con">
        <el-row>
          <el-col :span="12">
            <div style="text-align: center" class="grid-content ep-bg-purple">
              <p>有功功率电量：<span>74.934</span>万kWh</p>
              <p>无功功率电量：<span>7.297</span>万kWh</p>
              <p>功率因素：<img src="" alt="" srcset="" />=<span>1</span></p>
              <p>惩奖系数：<span>-0.75</span></p>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align: left" class="grid-content ep-bg-purple-light">
              <p>惩奖电费：<span>-10524.26</span></p>
              <p>考核基准：<span>0.9</span></p>
              <p
                style="
                  width: 100px;
                  height: 28px;
                  line-height: 28px;
                  background: #031825;
                  cursor: pointer;
                  text-align: center;
                  border-radius: 2px;
                "
              >
                <img src="" alt="" srcset="" />查对标
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.wrapper_left_last {
  height: 310px;
  margin-bottom: 40px;
  background: rgba(9, 15, 23, 0.3);
  display: flex;

  .balance {
    width: 36px;
    height: 90px;
    writing-mode: vertical-lr;
    background: #000a0f;
    border-radius: 2px;
    margin: auto;
    line-height: 36px;
    text-align: center;
    color: #eaf5ff;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }

  .th_index {
    width: 130px;

    div {
      width: 130px;
      height: 76px;
      background: rgba(9, 15, 23, 0.3);
      border: 1px solid #042c42;
      border-radius: 4px;
      margin: auto;
      text-align: center;
      line-height: 32px;
      color: #b7c4d1;
    }
  }

  .alculation_sheet {
    width: 556px;
    background: rgba(9, 15, 23, 0.3);
    border: 1px solid #212c3c;
    margin-left: 20px;

    .alculation_tie {
      height: 50px;
      border-bottom: 1px solid #1d2634;
      line-height: 50px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #eaf5ff;

      .alculation_icon {
        width: 18px;
        height: 18px;
        margin: 0px 18px;
      }
    }
  }
}
</style>
