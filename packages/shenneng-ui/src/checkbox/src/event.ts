export default {
  methods: [
    {
      label: '切换可见性',
      value: 'triggerVisible',
      props: ['visible'],
    },
    {
      label: '设置选中值',
      value: 'setSelectedValue',
      props: ['value'],
    },
  ],
  events: [
    {
      label: '选项变化',
      value: 'checkbox:change',
    },
  ],
};
