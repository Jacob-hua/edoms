<template>
  <div class="click-wrapper" @click="visible = true">
    <div class="wrap-report">
      <div class="wrap-icon">
        <img class="icon-report" src="./assets/outer-bg.png" alt="" />
      </div>
      <div class="label">{{ config.title }}</div>
    </div>
    <ElDrawer v-model="visible" direction="btt" size="90%">
      <template #header="{ titleId, titleClass }: any">
        <div :id="titleId" class="drawer-header" :class="titleClass">
          <div class="bgcontent">
            <img src="./assets/model-icon.png" alt="" class="icon-report" />
            <span class="label">{{ config.title }}</span>
          </div>
          <div class="close" @click="visible = false"></div>
        </div>
      </template>
      <div class="eq-wrapper">
        <div ref="groupTabsRef" class="group-tabs">
          <button
            v-for="(group, index) in groups"
            :key="index"
            :class="activeName === group ? ['group-tab-pane', 'group-tab-pane-active'] : ['group-tab-pane']"
            @click="handleGroupTabChange(group)"
          >
            {{ group }}
          </button>
        </div>
        <ConditionCard
          v-for="(condition, index) in conditions"
          :key="index"
          :condition="condition"
          :interval-delay="config.intervalDelay"
          :request="request"
        >
        </ConditionCard>
      </div>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';

import { ElDrawer } from '@edoms/design';

import useApp from '../../useApp';

import ConditionCard from './component/ConditionCard.vue';
import { MConditionItemConfig, MEquipmentCondition } from './type';

const props = defineProps<{
  config: MEquipmentCondition;
}>();

const { request } = useApp(props);

const visible = ref<boolean>(false);

const groupTabsRef = ref<HTMLElement>();

const activeName = ref<string>('全部');

const groups = computed<Set<string>>(() => {
  const result = new Set<string>();
  result.add('全部');
  return (
    props.config.groups?.reduce((groups, { group }) => {
      groups.add(group);
      return groups;
    }, result) ?? result
  );
});

const conditions = computed<MConditionItemConfig[]>(() => {
  if (activeName.value === '全部') {
    return props.config.conditions;
  }
  return props.config.conditions.filter(({ group }) => group === activeName.value);
});

watch(
  () => groupTabsRef.value,
  (groupTabsRef) => {
    if (!groupTabsRef) {
      return;
    }
    groupTabsRef.addEventListener('wheel', handleWheelChange, { passive: true });
  }
);

onUnmounted(() => {
  groupTabsRef.value?.removeEventListener('wheel', handleWheelChange);
});

function handleWheelChange(event: WheelEvent) {
  event.preventDefault();
  if (!groupTabsRef.value) {
    return;
  }
  groupTabsRef.value.scrollLeft += event.deltaY;
}

const handleGroupTabChange = (group: string) => {
  activeName.value = group;
};
</script>

<style lang="scss" scoped>
$tabPanBg: #29292a;
$tabPanColor: #999999;
$tabPanActiveColor: #00ffff;
$borderColor: #505152;

.click-wrapper {
  min-width: 117px;
  min-height: 80px;
  position: relative;

  .wrap-report {
    width: 100%;
    height: 100%;
    // background: rgba(0, 163, 255, 0.1);
    // border: 1px solid #051823;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .wrap-icon {
      width: 60px;
      height: 42px;
      margin-top: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 114, 179, 0.4);
      border: 1px solid #0072b3;
      border-radius: 4px;
      box-sizing: border-box;

      .icon-report {
        width: 22px;
        height: 24px;
      }
    }

    .label {
      margin-top: 7px;
      font-size: 14px;
      color: #ffffff;
      font-weight: 300;
    }
  }
}

:deep(.el-drawer.btt, .el-drawer.ttb) {
  width: 1800px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #000;
  border: 1px solid #013460;
}

:deep(.el-drawer__header) {
  padding: 0;
  margin: 0;
}

:deep(.el-drawer__body) {
  padding: 30px;
}

.drawer-header {
  height: 52px;
  line-height: 52px;
  color: #ffffff;
  font-weight: 400;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  background-image: url('./assets/bg_header.png');
  background-size: cover;
  border-bottom: 1px solid #013460;

  .bgcontent {
    width: 100%;
    height: 100%;
    display: flex;

    .icon-report {
      width: 24px;
      height: 24px;
      margin: 15px;
    }

    .label {
      color: #eaf5ff;
      font-size: 18px;
      font-weight: 400;
    }
  }

  .close {
    width: 14px;
    height: 14px;
    background-image: url('./assets/icon_close.png');
    background-size: 14px 14px;
    background-repeat: no-repeat;
    margin-top: 20px;
    margin-right: 20px;
    cursor: pointer;
  }
}

.eq-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
  column-gap: 30px;
}

.group-tabs {
  grid-column: 1 / span 2;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
}

.group-tab-pane {
  width: 120px;
  height: 36px;
  line-height: 36px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #eaf5ff;
  background: #00141f;
  border: 0;
  margin-right: 10px;

  &-active {
    background: #002a42;
    border: 1px solid #007bc0;
    color: #ffffff;
  }
}
</style>
