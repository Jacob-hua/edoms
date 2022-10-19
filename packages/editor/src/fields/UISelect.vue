<template>
  <div v-if="uiSelectMode" class="m-fields-ui-select" @click="cancelHandler">
    <el-button type="danger" :icon="Delete" text style="padding: 0">取消</el-button>
  </div>
  <div v-else class="m-fields-ui-select" style="display: flex" @click="startSelect">
    <el-tooltip content="清除">
      <el-button v-if="val" style="padding: 0" type="danger" :icon="Close" text @click.stop="deleteHandler"></el-button>
    </el-tooltip>
    <el-tooltip :content="val ? toName + '_' + val : '点击此处选择'">
      <el-button text style="padding: 0; margin: 0">{{ val ? toName + '_' + val : '点击此处选择' }}</el-button>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, markRaw, ref } from 'vue';
import { Close, Delete, Pointer } from '@element-plus/icons-vue';

import { FormState } from '@tmagic/form';

import { Services } from '../type';

export default defineComponent({
  name: 'MFieldsUiSelect',
  expose: [],
  props: {
    // eslint-disable-next-line vue/require-default-prop, vue/no-unused-properties
    labelWidth: String,
    // eslint-disable-next-line vue/require-default-prop, vue/no-unused-properties
    config: Object,
    // eslint-disable-next-line vue/require-default-prop
    model: Object,
    prop: {
      type: String,
      default() {
        return '';
      },
    },
    name: String,
  },

  emits: ['change'],

  setup(props: any, { emit }) {
    const services = inject<Services>('services');
    const mForm = inject<FormState>('mForm');
    const val = computed(() => props.model[props.name]);
    const uiSelectMode = ref(false);

    const cancelHandler = () => {
      if (!services?.uiService) return;
      services.uiService.set<boolean>('uiSelectMode', false);
      uiSelectMode.value = false;
      // eslint-disable-next-line no-undef
      globalThis.document.removeEventListener('ui-select', clickHandler as EventListener);
    };

    const clickHandler = ({ detail }: Event & { detail: any }) => {
      if (detail.id) {
        // eslint-disable-next-line vue/no-mutating-props
        props.model[props.name] = detail.id;
        emit('change', detail.id);
        // eslint-disable-next-line vue/custom-event-name-casing
        mForm?.$emit('field-change', props.prop, detail.id);
      }

      if (cancelHandler) {
        cancelHandler();
      }
    };

    return {
      Delete: markRaw(Delete),
      Pointer: markRaw(Pointer),
      Close: markRaw(Close),

      val,
      uiSelectMode,
      toName: computed(() => {
        const config = services?.editorService.getNodeById(val.value);
        return config?.name || '';
      }),

      startSelect() {
        if (!services?.uiService) return;
        services.uiService.set<boolean>('uiSelectMode', true);
        uiSelectMode.value = true;
        // eslint-disable-next-line no-undef
        globalThis.document.addEventListener('ui-select', clickHandler as EventListener);
      },

      cancelHandler,

      deleteHandler() {
        if (props.model) {
          // eslint-disable-next-line vue/no-mutating-props
          props.model[props.name] = '';
          emit('change', '');
          // eslint-disable-next-line vue/custom-event-name-casing
          mForm?.$emit('field-change', props.prop, '');
        }
      },
    };
  },
});
</script>

<style lang="scss">
.m-fields-ui-select {
  cursor: pointer;
  i {
    margin-right: 3px;
  }
  span {
    color: #2882e0;
  }
}
</style>
