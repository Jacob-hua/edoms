export default {
  events: [
    {
      label: '数据刷新',
      value: 'global-schematic:flush',
    },
  ],
  methods: [
    {
      label: '切换可见性',
      value: 'triggerVisible',
      props: ['visible'],
    },
  ],
};
