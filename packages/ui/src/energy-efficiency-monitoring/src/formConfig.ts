import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
  {
    text: '轮询间隔',
    name: 'intervalDelay',
    type: 'number',
    min: 1000,
    step: 1000,
    defaultValue: 10000,
  },
  {
    text: '能效名称',
    name: 'energyName',
    defaultValue: 'COP',
  },
  ...(await useInstanceConfig(request, 'energy-efficiency-monitoring')),
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
    name: 'refrenceValue',
    defaultValue: '',
    onChange: (state: any, refrenceValue: any, { model }: any) => {
      if (Number(refrenceValue) < Number(model.minValue)) {
        model.refrenceValue = model.minValue;
      }
      if (Number(refrenceValue) > Number(model.maxValue)) {
        model.refrenceValue = model.maxValue;
      }
      return model.refrenceValue;
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
    name: 'refrenceLineColor',
    defaultValue: '#fff',
  },
  {
    text: '游标',
    type: 'colorPicker',
    name: 'cursorColor',
    defaultValue: '#008000',
  },
];
