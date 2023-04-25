<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-24 11:45:45
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-24 17:07:40
-->
<template>
  <div class="wrap-bottom">
    <div class="left"></div>
    <div class="right"></div>
  </div>
</template>

<style lang="scss" scoped>
.wrap-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 3px;
  display: flex;
  justify-content: space-between;
  .left,
  .right {
    width: 3%;
    background-color: rgba($color: #0080ed, $alpha: 1);
  }
}
</style>
