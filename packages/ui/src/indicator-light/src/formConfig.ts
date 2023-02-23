export default [
  {
    text: '初始值',
    name: 'initValue',
    type: 'number',
  },
  {
    text: '指示灯',
    name: 'lights',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加指示灯',
    maxItems: 5,
    title: (model: any, index: number | string) => `# ${index}`,
    items: [
      {
        text: '亮灯颜色',
        type: 'colorPicker',
        name: 'color',
      },
      {
        text: '最小值',
        type: 'number',
        name: 'minValue',
      },
      {
        text: '最大值',
        type: 'number',
        name: 'maxValue',
      },
    ],
  },
];
