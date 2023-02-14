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
    append: 'ms',
  },
  {
    text: '监测',
    name: 'monitorings',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加监测能效',
    maxItems: 10,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '能效名称',
        name: 'energyName',
        defaultValue: '',
      },
      ...(await useInstanceConfig(request, 'multiple-energy-monitoring')),
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
        text: '目标值',
        name: 'targetValue',
        defaultValue: '',
        onChange: (state: any, targetValue: any, { model }: any) => {
          if (Number(targetValue) < Number(model.minValue)) {
            model.targetValue = model.minValue;
          }
          if (Number(targetValue) > Number(model.maxValue)) {
            model.targetValue = model.maxValue;
          }
          return model.targetValue;
        },
      },
    ],
  },
  {
    text: '实际值',
    type: 'colorPicker',
    name: 'efficiencyColor',
    defaultValue: '#FFFF00',
  },
  {
    text: '目标值',
    type: 'colorPicker',
    name: 'targetLineColor',
    defaultValue: '#fff',
  },
];
