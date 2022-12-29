export default () => [
  {
    text: '能效名称',
    name: 'energyName',
    defaultValue: 'COP',
  },
  {
    text: '最小值',
    name: 'minValue',
    defaultValue: '2.0',
  },
  {
    text: '最大值',
    name: 'maxValue',
    defaultValue: '6.0',
  },
  {
    text: '参考值',
    name: 'referenceValue',
    defaultValue: '4.3',
    onChange: (state: any, referenceValue: any, { model }: any) => {
      if (Number(referenceValue) < Number(model.minValue)) {
        model.referenceValue = model.minValue;
      }
      if (Number(referenceValue) > Number(model.maxValue)) {
        model.referenceValue = model.maxValue;
      }
      return model.referenceValue;
    },
  },
  {
    type: 'number',
    name: 'bisectionNumber',
    text: '等分数量',
    min: 1,
    max: 10,
    step: 1,
    defaultValue: 5,
  },
  {
    text: '开始颜色',
    type: 'colorPicker',
    name: 'startColor',
    defaultValue: '#FFFF00',
  },
  {
    text: '结束颜色',
    type: 'colorPicker',
    name: 'endColor',
    defaultValue: '#FF0000',
  },
  {
    text: '参考线颜色',
    type: 'colorPicker',
    name: 'referenceLineColor',
    defaultValue: '#fff',
  },
  {
    text: '游标颜色',
    type: 'colorPicker',
    name: 'cursorColor',
    defaultValue: '#008000',
  },
];
