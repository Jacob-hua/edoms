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
      label: '设置二维码',
      value: 'setQrcode',
      props: ['url'],
    },
  ],
};
