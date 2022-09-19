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
      <GridView
        :title-props="{ effect: 'dark' }"
        :spacing="{ horizontal: '15px', vertical: '20px' }"
        height="850px"
        :menus="panelMenuList"
        :data="listData"
        @load-more="loadMore"
        @add="add"
      >
        <template #iconSlot>
          <MoreFilled />
        </template>
      </GridView>
    </div>
  </div>
</template>

<script setup lang="ts">
import GridView from '@/components/GridView.vue'
import { ref } from 'vue'
import { Menu } from '@/components/type'
import LongText from '@/components/LongText.vue'

const listData = ref([
  {
    appName: '陕汽冷站',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '北七家项目',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽冷站',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '北七家项目',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽冷站',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '北七家项目',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽冷站',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '北七家项目',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽冷站',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '北七家项目',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽冷站',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '北七家项目',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽冷站',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '北七家项目',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽冷站',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '北七家项目',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽冷站',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '北七家项目',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
  {
    appName: '陕汽',
    appImgUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d',
  },
])

const loadMore = (data: any) => {
  console.log(data)
  listData.value = listData.value.concat(data.slice(0, 11))
}
const add = () => {
  console.log('add')
}

const panelMenuList = ref<Array<Menu<{ appName: string; appImgUrl: string }>>>([
  {
    iconSize: 20,
    iconColor: '#000',
    icon: 'Operation',
    name: '发布应用',
    action: (currentData) => {
      console.log(currentData)
      return '123'
    },
  },
  {
    iconSize: 20,
    iconColor: '#000',
    icon: 'Operation',
    name: '设置',
    action: () => {
      console.log('设置')
    },
  },
])
</script>

<style lang="scss">
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
