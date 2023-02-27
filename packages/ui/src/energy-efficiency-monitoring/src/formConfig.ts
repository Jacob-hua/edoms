import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
  {
    text: '轮询间隔',
    name: 'intervalDelay',
    type: 'number',
    min: 1,
    step: 1,
    defaultValue: 10,
    append: 's',
  },
  {
    text: '能效名称',
    name: 'energyName',
    defaultValue: 'COP',
  },
  ...(await useInstanceConfig(request, 'energy-efficiency-monitoring', ['property', 'propertyType', 'unit'])),
  {
    text: '最小值',
    name: 'minValue',
    defaultValue: '',
  },
  {
    text: '最大值',
    name: 'maxValue',
    defaultValue: '',
  },
  {
    text: '参考值',
    name: 'referenceValue',
    defaultValue: '',
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
    text: '曲线颜色',
    type: 'colorPicker',
    name: 'lineColor',
    defaultValue: '#008000',
  },
  {
    text: '最小值',
    type: 'colorPicker',
    name: 'startColor',
    defaultValue: '#FFFF00',
  },
  {
    text: '最大值',
    type: 'colorPicker',
    name: 'endColor',
    defaultValue: '#FF0000',
  },
  {
    text: '参考值',
    type: 'colorPicker',
    name: 'referenceLineColor',
    defaultValue: '#fff',
  },
  {
    text: '游标',
    type: 'colorPicker',
    name: 'cursorColor',
    defaultValue: '#008000',
  },
];
