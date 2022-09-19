<template>
  <el-scrollbar :height="height">
    <div class="scroll-container">
      <ul v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
        <slot name="firstBox"></slot>
        <li v-for="(list, index) in data" :key="index">
          <div class="app-box">
            <PopoverMenu :list="list" :menus="menus">
              <template #iconSlot>
                <slot name="iconSlot"></slot>
              </template>
            </PopoverMenu>
          </div>
          <LongText
            :effect="titleProps.effect"
            :content-style="titleProps.contentStyle"
            :lines-clamp="titleProps.linesClamp"
            :placement="titleProps.placement"
            :content="list.appName"
          ></LongText>
        </li>
      </ul>
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import LongText from '@/components/LongText.vue'
import PopoverMenu from './PopoverMenu.vue'
import { Menu, Space, TileProps } from './type'

export default defineComponent({
  expose: [],
  components: { LongText, PopoverMenu },
  props: {
    titleProps: {
      type: Object as PropType<TileProps>,
      default: () => ({
        effect: 'dark',
        contentStyle: {
          width: '96px',
          color: '',
          fontSize: '16px',
        },
        linesClamp: 1,
        placement: 'top',
      }),
    },
    menus: {
      type: Array as PropType<Array<Menu>>,
      required: true,
      default: () => [],
    },
    data: {
      type: Array as PropType<any>,
      default: () => [],
    },
    height: {
      type: String as PropType<string>,
      default: () => '',
    },
    spacing: {
      type: Object as PropType<Space>,
      default: () => ({
        horizontal: '15px',
        vertical: '20px',
      }),
    },
  },
  emits: ['loadMore'],
  setup(props, { emit }) {
    const disabled = ref<boolean>(false)
    const load = () => {
      emit('loadMore', props.data)
    }
    return {
      load,
      disabled,
    }
  },
})
</script>

<style lang="scss" scoped>
.scroll-container {
  display: flex;
  ul {
    display: flex;
    list-style: none;
    flex-wrap: wrap;
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: v-bind('spacing.vertical');
      margin-right: v-bind('spacing.horizontal');
      .app-box {
        text-align: center;
        width: 200px;
        height: 200px;
        display: flex;
        border: 1px solid #000;
        background: url('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201708%2F02%2F20170802140436_2nKfL.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665804427&t=3bdb5a5dd1859114f01fc3165e30338d');
        justify-content: flex-end;
      }
    }
  }
}
</style>
