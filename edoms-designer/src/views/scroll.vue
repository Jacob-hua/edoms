<template>
  <div class="list-container">
    <div id="carList" class="marquee">
      <template v-for="(item, index) in dataMap.list" :key="index">
        <div class="list-item">
          <div class="item-name text-overflow">{{ item.name }}</div>
          <div class="item-road text-overflow">{{ item.road }}</div>
        </div>
      </template>
    </div>
  </div>
  <div id="box">
    编程适合那些有不同想法的人... <br />
    对于那些想要创造大事物并愿意改变世界的人们。
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';

const dataMap = reactive({
  list: [
    { name: '浙A89268ddddddddddddddddddd', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 1 },
    { name: '浙A89268jjjjjjjjjjjjjjjjjjj', road: '游8路', status: 0 },
    { name: '浙A89268ggggggggggggggg', road: '游8路', status: 1 },
    { name: '浙A8926jjjjjjjjjjjjjjjjjjj8', road: '游1路', status: 0 },
    { name: '浙A89268ddddddddddddddddddd', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 1 },
    { name: '浙A89268jjjjjjjjjjjjjjjjjjj', road: '游8路', status: 0 },
    { name: '浙A89268ggggggggggggggg', road: '游8路', status: 1 },
    { name: '浙A8926jjjjjjjjjjjjjjjjjjj8', road: '游1路', status: 0 },
    { name: '浙A89268ddddddddddddddddddd', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 1 },
    { name: '浙A89268jjjjjjjjjjjjjjjjjjj', road: '游8路', status: 0 },
    { name: '浙A89268ggggggggggggggg', road: '游8路', status: 1 },
    { name: '浙A8926jjjjjjjjjjjjjjjjjjj8', road: '游1路', status: 0 },
    { name: '浙A89268ddddddddddddddddddd', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 1 },
    { name: '浙A89268jjjjjjjjjjjjjjjjjjj', road: '游8路', status: 0 },
    { name: '浙A89268ggggggggggggggg', road: '游8路', status: 1 },
    { name: '浙A8926jjjjjjjjjjjjjjjjjjj8', road: '游1路', status: 0 },
    { name: '浙A89268ddddddddddddddddddd', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 1 },
    { name: '浙A89268jjjjjjjjjjjjjjjjjjj', road: '游8路', status: 0 },
    { name: '浙A89268ggggggggggggggg', road: '游8路', status: 1 },
    { name: '浙A89268ggggggggggggggg', road: '游8路', status: 1 },
    { name: '浙A8926jjjjjjjjjjjjjjjjjjj8', road: '游1路', status: 0 },
    { name: '浙A89268ddddddddddddddddddd', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 0 },
    { name: '浙A89268fffffffffffffffffff', road: '游8路', status: 1 },
    { name: '浙A89268jjjjjjjjjjjjjjjjjjj', road: '游8路', status: 0 },
  ],
});
onMounted(() => {
  dataMap.list = dataMap.list.concat(dataMap.list);
});
</script>

<style lang="scss" scoped>
.list-container {
  width: 1440px;
  height: 600px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}
//无限滚动
.marquee {
  //animation-delay: -5s;
  animation: marquee 35s linear infinite;
}
.marquee:hover {
  animation-play-state: paused;
}
@keyframes marquee {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-51%); //这里不是-100%！
  }
}

@keyframes animated-border {
  0% {
    border-width: 8px;
  }
  50% {
    border-width: 4px;
  }
  100% {
    border-width: 1px;
  }
}
#box {
  animation: animated-border 1.5s infinite;
  font-size: 18px;
  line-height: 30px;
  font-weight: bold;
  color: #333;
  border: 2px solid;
  border-radius: 10px;
  padding: 15px;
}
</style>
