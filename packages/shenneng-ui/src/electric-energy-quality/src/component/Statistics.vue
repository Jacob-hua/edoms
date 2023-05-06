<template>
  <div class="wrapper-con-left">
    <div class="fluctuation">
      <div class="fluctuation_tie">
        <img class="icon-left" src="../../assets/icon.png" alt="" />
        <span class="elefont">电压波动</span>
      </div>
      <div class="fluctuation_con">
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">0</span>次</p>
          <p>变动范围：3~4%</p>
        </div>
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">0</span>次</p>
          <p>变动范围：2~3%</p>
        </div>
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">0</span>次</p>
          <p>变动范围：1.5~2%</p>
        </div>
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">0</span>次</p>
          <p>变动范围：≤1.5%</p>
        </div>
      </div>
    </div>
    <div class="fluctuation">
      <div class="fluctuation_tie">
        <img class="icon-left" src="../../assets/icon.png" alt="" />
        <span class="elefont">过电压</span>
      </div>
      <div class="fluctuation_con">
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">0</span>次</p>
          <p>变动范围：3~4%</p>
        </div>
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">1</span>次</p>
          <p>变动范围：2~3%</p>
        </div>
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">27</span>次</p>
          <p>变动范围：1.5~2%</p>
        </div>
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">421</span>次</p>
          <p>变动范围：≤1.5%</p>
        </div>
      </div>
    </div>
    <div class="fluctuation">
      <div class="fluctuation_tie">
        <img class="icon-left" src="../../assets/icon.png" alt="" />
        <span class="elefont">欠电压</span>
      </div>
      <div class="fluctuation_con">
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">0</span>次</p>
          <p>变动范围：3~4%</p>
        </div>
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">1</span>次</p>
          <p>变动范围：2~3%</p>
        </div>
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">27</span>次</p>
          <p>变动范围：1.5~2%</p>
        </div>
        <div class="con_sub">
          <p><span style="color: #41e4de; font-size: 20px">421</span>次</p>
          <p>变动范围：≤1.5%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.wrapper-con-left {
  height: 610px;
  margin-right: 30px;
  background: rgba(9, 15, 23, 0.3);
  border-bottom: 1px solid #212c3c;
  .fluctuation:nth-child(n + 2) {
    margin-top: 30px;
  }
  .fluctuation:first-child {
    margin-top: 10px;
  }
  .fluctuation {
    height: 188px;
    border: 1px solid #212c3c;
    .fluctuation_tie {
      height: 51px;
      border-bottom: 1px solid #1d2634;
      line-height: 51px;

      .icon-left {
        margin-left: 18px;
        margin-right: 16px;
      }

      .elefont {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #eaf5ff;
      }
    }

    .fluctuation_con {
      height: 136px;
      display: flex;

      .con_sub {
        width: 150px;
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
  }
}
</style>
