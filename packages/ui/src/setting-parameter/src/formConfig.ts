export default () => [
  {
    text: '展示参数量',
    name: 'visibleNumber',
    type: 'number',
    min: 0,
    max: 4,
  },
  {
    type: 'groupList',
    text: '设置参数',
    name: 'parameters',
    labelWidth: '80px',
    defaultValue: [],
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'propName',
        text: '参数名称',
        type: 'text',
        placeholder: '请填写参数名称',
        trim: true,
      },
      {
        name: 'propValue',
        text: '参数值',
        type: 'text',
        placeholder: '请填写参数值',
        trim: true,
      },
      {
        name: 'propUnit',
        text: '单位',
        type: 'text',
        placeholder: '请填写单位',
      },
    ],
  },
];
