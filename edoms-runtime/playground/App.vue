<template>
  <edoms-ui-page v-if="pageConfig" :config="pageConfig"></edoms-ui-page>
</template>

<script lang="ts" setup>
import { computed, nextTick, provide, reactive, ref, watch } from 'vue';

import Core from '@edoms/core';
import type { Id, MApp, MNode } from '@edoms/schema';
import { RemoveData, UpdateData } from '@edoms/stage';
import { getNodePath } from '@edoms/utils';

const root = ref<MApp>();
const curPageId = ref<Id>();
const selectedId = ref<Id>();

const pageConfig = computed(
  () => root.value?.items?.find((item: MNode) => item.id === curPageId.value) || root.value?.items?.[0]
);

const designWidth = document.documentElement.getBoundingClientRect().width;
const filePreviewUrl = import.meta.env.VITE_FILE_PREVIEW_URL;
const app = new Core({
  designWidth,
  config: root.value,
  platform: 'editor',
  filePreviewUrl,
});

window.appInstance = app;

provide('app', app);

provide('request', undefined);

watch(pageConfig, async () => {
  await nextTick();
  const page = document.querySelector<HTMLElement>('.edoms-ui-page');
  page && window.edoms.onPageElUpdate(page);
});

window.edoms?.onRuntimeReady({
  getApp() {
    return app;
  },

  updateRootConfig(config: MApp) {
    console.log('update config', config);
    root.value = config;
    app?.setConfig(config, curPageId.value);
  },

  updatePageId(id: Id) {
    console.log('update page id', id);
    curPageId.value = id;
    app?.setPage(id);
  },

  select(id: Id) {
    console.log('select config', id);
    selectedId.value = id;
    const el = document.getElementById(`${id}`);
    if (el) return el;
    // 未在当前文档下找到目标元素，可能是还未渲染，等待渲染完成后再尝试获取
    return nextTick().then(() => document.getElementById(`${id}`) as HTMLElement);
  },

  add({ config, parentId }: UpdateData) {
    console.log('add config', config);

    if (!root.value) throw new Error('error');
    if (!selectedId.value) throw new Error('error');
    if (!parentId) throw new Error('error');

    const parent = getNodePath(parentId, [root.value]).pop();
    if (!parent) throw new Error('未找到父节点');
    if (parent.id !== selectedId.value) {
      // add page
      const index = parent.items?.findIndex((child: MNode) => child.id === selectedId.value);
      parent.items?.splice(index + 1, 0, config);
    } else {
      // add component
      // 新增节点添加到配置中
      parent.items?.push(config);
    }
    if (app.page) {
      app.page.initNode(config, app.page.getNode(parent.id) ?? app.page);
    }
  },

  update({ config, parentId }: UpdateData) {
    console.log('update config', config);

    if (!root.value) throw new Error('error');
    const node = getNodePath(config.id, [root.value]).pop();

    if (!parentId) throw new Error('error');
    const parent = getNodePath(parentId, [root.value]).pop();

    if (!node) throw new Error('未找到目标节点');
    if (!parent) throw new Error('未找到父节点');
    const index = parent.items?.findIndex((child: MNode) => child.id === node.id);
    parent.items.splice(index, 1, reactive(config));
    if (app.page) {
      app.page.initNode(config, app.page.getNode(parent.id) ?? app.page);
    }
  },

  remove({ id, parentId }: RemoveData) {
    if (!root.value) throw new Error('error');

    const node = getNodePath(id, [root.value]).pop();
    if (!node) throw new Error('未找到目标元素');

    const parent = getNodePath(parentId, [root.value]).pop();
    if (!parent) throw new Error('未找到父元素');

    const index = parent.items?.findIndex((child: MNode) => child.id === node.id);
    parent.items.splice(index, 1);
    if (app.page) {
      app.page.deleteNode(id);
    }
  },
});
</script>
