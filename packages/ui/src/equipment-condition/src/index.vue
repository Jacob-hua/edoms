<template>
  <div class="eq-wrapper">
    <div class="group-tabs">
      <button
        v-for="(group, index) in groups"
        :key="index"
        :class="activeName === group ? ['group-tab-pane', 'group-tab-pane-active'] : ['group-tab-pane']"
        @click="handleGroupTabChange(group)"
      >
        {{ group }}
      </button>
    </div>
    <ConditionCard :condition="condition"></ConditionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import useApp from '../../useApp';

import ConditionCard from './component/ConditionCard.vue';
import { MConditionItemConfig, MEquipmentCondition } from './type';

const props = defineProps<{
  config: MEquipmentCondition;
}>();

useApp(props);

const activeName = ref<string>('全部');

const condition = computed<MConditionItemConfig>(() => props.config.conditions[0]);

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

const handleGroupTabChange = (group: string) => {
  activeName.value = group;
};
</script>

<style lang="scss" scoped>
$tabPanBg: #29292a;
$tabPanColor: #999999;
$tabPanActiveColor: #00ffff;
$borderColor: #505152;

.eq-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
  column-gap: 12px;
}
.group-tabs {
  grid-column: 1 / span 2;
}
.group-tab-pane {
  width: 86px;
  height: 42px;
  line-height: 40px;
  background: $tabPanBg;
  border: 1px solid $borderColor;
  border-radius: 3px;
  color: $tabPanColor;
  margin-right: 4px;

  &-active {
    border-bottom: 2px solid $tabPanActiveColor;
    color: $tabPanActiveColor;
  }
}
</style>
