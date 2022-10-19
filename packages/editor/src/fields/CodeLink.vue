<template>
  <m-fields-link :config="formConfig" :model="modelValue" name="form" @change="changeHandler"></m-fields-link>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watchEffect } from 'vue';
import serialize from 'serialize-javascript';

interface CodeLinkConfig {
  type: 'code-link';
  name: string;
  text?: string;
  formTitle?: string;
}

export default defineComponent({
  name: 'MFieldsCodeLink',
  expose: [],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    config: {
      type: Object as PropType<CodeLinkConfig>,
    },

    // eslint-disable-next-line vue/require-default-prop
    model: {
      type: Object,
    },

    // eslint-disable-next-line vue/require-default-prop
    name: {
      type: String,
    },

    // eslint-disable-next-line vue/require-default-prop, vue/no-unused-properties
    prop: {
      type: String,
    },
  },

  emits: ['change'],

  setup(props, { emit }) {
    const modelValue = ref<{ form: Record<string, any> }>({
      form: {},
    });

    watchEffect(() => {
      if (!props.model || !props.name) return;
      modelValue.value.form[props.name] = serialize(props.model[props.name], {
        space: 2,
        unsafe: true,
      }).replace(/"(\w+)":\s/g, '$1: ');
    });

    return {
      modelValue,

      formConfig: computed(() => ({
        ...props.config,
        text: '',
        type: 'link',
        form: [
          {
            name: props.name,
            type: 'vs-code',
          },
        ],
      })),

      changeHandler(v: Record<string, any>) {
        if (!props.name || !props.model) return;

        try {
          // eslint-disable-next-line no-eval, vue/no-mutating-props
          props.model[props.name] = eval(`${v[props.name]}`);
          emit('change', props.model[props.name]);
        } catch (e) {
          console.error(e);
        }
      },
    };
  },
});
</script>
