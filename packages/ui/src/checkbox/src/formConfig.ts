export default [
  // {
  //   text: '选中颜色',
  //   name: 'fill',
  //   type: 'colorPicker',
  // },
  {
    text: '备选项',
    name: 'options',
    type: 'groupList',
    labelWidth: '80px',
    title: (model: any, index: number | string) => `# ${index} ${model.label}`,
    items: [
      {
        name: 'label',
        text: '标签',
      },
      {
        name: 'value',
        text: '值',
      },
      {
        name: 'disabled',
        text: '是否禁用',
        type: 'switch',
      },
      {
        name: 'selected',
        text: '默认选择',
        type: 'switch',
      },
    ],
  },
];
