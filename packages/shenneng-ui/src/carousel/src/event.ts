export default {
  methods: [
    {
      label: '切换可见性',
      value: 'triggerVisible',
      props: ['visible'],
    },
    {
      label: '切换上一张',
      value: 'switchPre',
    },
    {
      label: '切换下一张',
      value: 'switchNext',
    },
    {
      label: '跳转到第n张',
      value: 'jumpTo',
      props: ['num'],
    },
  ],
  events: [
    {
      label: '切换图片',
      value: 'carousel:change',
    },
  ],
};
