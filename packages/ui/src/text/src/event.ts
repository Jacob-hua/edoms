export default {
  methods: [
    {
      label: '显示',
      value: 'show',
    },
    {
      label: '隐藏',
      value: 'hide',
    },
    {
      label: '设置文本',
      value: 'setText',
      props: ['text'],
    },
    {
      label: '设置不可用文本',
      value: 'setDisabledText',
      props: ['disabledText'],
    },
  ],
};
