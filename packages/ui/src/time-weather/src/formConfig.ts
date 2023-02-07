export default () => [
  {
    text: '更新间隔',
    name: 'intervalDelay',
    type: 'number',
    min: 1000,
    step: 1000,
    defaultValue: 1000000,
    append: 'ms',
  },
];
