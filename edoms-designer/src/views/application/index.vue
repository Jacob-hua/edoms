<template>
  <div class="container">
    <div class="container-left">
      <div class="user-info">
        <img
          alt=""
          src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202005%2F02%2F20200502185802_FuFU2.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666144323&t=9f3d6e4acb3a5c8ca6b7bdfcdfc403fa"
        />
        <LongText :content-style="{ marginBottom: '20px' }" effect="dark" content="王麻子"></LongText>
      </div>
    </div>
    <div class="container-right">
      <GridGroup
        :title-props="{ effect: 'dark' }"
        :spacing="{ horizontal: '35px', vertical: '15px' }"
        height="850px"
        :menus="panelMenuList"
        :data="listData"
        @load-more="loadMore"
        @add="add"
      >
        <template #iconSlot>
          <MoreFilled />
        </template>
      </GridGroup>
    </div>
    <NewApp
      v-if="visible"
      v-model:visible="visible"
      @refresh-list="concatApplications(initData, { page: 0, limit: 16 })"
    ></NewApp>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import GridGroup from '@/components/GridGroup.vue';
import LongText from '@/components/LongText.vue';
import { useApplication } from '@/views/application/useApplication';

import NewApp from './component/NewApp.vue';
const { panelMenuList, listData, initData, visible, loadMore, add, concatApplications } = useApplication(useRouter());
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  margin-top: 30px;
  .container-left {
    width: 30%;
    margin-right: 40px;
    border-right: 1px solid #3333;
    .user-info {
      margin-top: 35px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 200px;
      margin-left: 30%;
      background-size: 200px 200px;
      img {
        width: 200px;
        height: 200px;
      }
    }
  }
  .container-right {
    width: 75%;
  }
}
</style>
