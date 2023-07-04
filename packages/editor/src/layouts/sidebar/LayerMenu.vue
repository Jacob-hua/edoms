<template>
  <content-menu ref="menu" :menu-data="menuData" style="overflow: initial"></content-menu>
</template>

<script lang="ts" setup>
import { computed, inject, markRaw, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Delete, DocumentCopy, Files, Plus } from '@element-plus/icons-vue';

import { NodeType } from '@edoms/schema';

import ContentMenu from '../../components/ContentMenu.vue';
import type { ComponentGroup, MenuButton, MenuComponent, Services } from '../../type';
const { t } = useI18n();
const services = inject<Services>('services');
const menu = ref<InstanceType<typeof ContentMenu>>();
const node = computed(() => services?.editorService.get('node'));
const isRoot = computed(() => node.value?.type === NodeType.ROOT);
const isPage = computed(() => node.value?.type === NodeType.PAGE);
const componentList = computed(() => services?.componentListService.getList() || []);

const layerContentMenu = inject<(MenuComponent | MenuButton)[]>('layerContentMenu', []);

const createMenuItems = (group: ComponentGroup): MenuButton[] =>
  group.items.map((component) => ({
    text: component.text,
    type: 'button',
    icon: component.icon,
    handler: () => {
      services?.editorService.add({
        name: component.text,
        type: component.type,
        ...(component.data || {}),
      });
    },
  }));

const getSubMenuData = computed<MenuButton[]>(() => {
  if (node.value?.type === 'tabs') {
    return [
      {
        text: t('editor.tabs'),
        type: 'button',
        icon: Files,
        handler: () => {
          services?.editorService.add({
            type: 'tab-pane',
          });
        },
      },
    ];
  }
  if (node.value?.items) {
    return (
      componentList.value.reduce(
        (subMenuData: MenuButton[], group: ComponentGroup, index) =>
          subMenuData.concat(
            createMenuItems(group),
            index < componentList.value.length - 1
              ? [
                  {
                    type: 'divider',
                    direction: 'horizontal',
                  },
                ]
              : []
          ),
        []
      ) || []
    );
  }
  return [];
});

const menuData = computed<(MenuButton | MenuComponent)[]>(() => [
  {
    type: 'button',
    text: t('editor.add1'),
    icon: markRaw(Plus),
    display: () => node.value?.items,
    items: getSubMenuData.value,
  },
  {
    type: 'button',
    text: t('editor.copy'),
    icon: markRaw(DocumentCopy),
    display: () => !isRoot.value,
    handler: () => {
      node.value && services?.editorService.copy(node.value);
    },
  },
  {
    type: 'button',
    text: t('editor.delete'),
    icon: markRaw(Delete),
    display: () => !isRoot.value && !isPage.value,
    handler: () => {
      node.value && services?.editorService.remove(node.value);
    },
  },
  ...layerContentMenu,
]);

const show = (e: MouseEvent) => {
  menu.value?.show(e);
};

defineExpose({
  show,
});
</script>
