<template>
  <el-scrollbar :height="height">
    <div class="scroll-container">
      <ul v-infinite-scroll="load" :infinite-scroll-immediate="false" :infinite-scroll-disabled="disabled">
        <slot name="firstBox"></slot>
        <li v-for="(item, index) in gridData" :key="index">
          <div class="app-box">
            <img alt="" :src="item.imgUrl" />
            <div class="popover">
              <PopoverMenu :menus="item.menus">
                <template #iconSlot>
                  <slot name="iconSlot"></slot>
                </template>
              </PopoverMenu>
            </div>
          </div>
          <LongText
            :effect="titleProps.effect"
            :content-style="titleProps.contentStyle"
            :lines-clamp="titleProps.linesClamp"
            :placement="titleProps.placement"
            :content="item.name"
          ></LongText>
        </li>
      </ul>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" name="GridView" setup>
import { computed, ref } from 'vue'
import { Menu, Space, TileProps } from './type'
import LongText from '@/components/LongText.vue'
import PopoverMenu from './PopoverMenu.vue'
const props = withDefaults(
  defineProps<{
    titleProps?: TileProps
    menus?: Array<Menu>
    data?: Array<any>
    height?: string
    spacing?: Space
  }>(),
  {
    titleProps: () => ({
      effect: 'dark',
      contentStyle: {
        width: '96px',
        color: '',
        fontSize: '16px',
      },
      linesClamp: 1,
      placement: 'top',
    }),
    menus: () => [],
    data: () => [],
    height: () => '',
    spacing: () => ({
      horizontal: '15px',
      vertical: '20px',
    }),
  }
)
const emit = defineEmits(['loadMore'])
const disabled = ref<boolean>(false)
const load = () => {
  emit('loadMore', props.data)
}
const gridData = computed(() => {
  return props.data.map((item: any) => {
    return {
      ...item,
      menus: props.menus.map((menu) => {
        return {
          ...menu,
          action: () => {
            menu.action(item)
          },
        }
      }),
    }
  })
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
        border: 1px solid #000;
        img {
          width: 198px;
          height: 198px;
        }
        .popover {
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
  }
}
</style>
