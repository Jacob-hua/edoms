import { Request } from '@edoms/editor';

import { MEnvironmentIndicator } from '../../types';
import useInstanceConfig from '../../useInstanceConfig';

const indicatorTypes = [
  {
    text: '温度',
    value: MEnvironmentIndicator.TEMPERATURE,
  },
  {
    text: '湿度',
    value: MEnvironmentIndicator.MOISTURE,
  },
  {
    text: '液体深度',
    value: MEnvironmentIndicator.LIQUID_DEPTH,
  },
  {
    text: '气体',
    value: MEnvironmentIndicator.GAS,
  },
];

export default async (request: Request) => [
  {
    text: '展示指标数',
    name: 'visibleNumber',
    type: 'number',
    min: 0,
  },
  {
    text: '监测指标',
    name: 'indicators',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加指标',
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'type',
        text: '指标',
        type: 'select',
        options: indicatorTypes,
      },
      {
        name: 'label',
        text: '标签',
        type: 'text',
        trim: true,
      },
      /** 注入业务组件的共通字段 */
      ...(await useInstanceConfig(request)),
      {
        name: 'expectedMax',
        text: '预期最大值',
        type: 'number',
        append: '公斤',
      },
      {
        name: 'expectedMin',
        text: '预期最小值',
        type: 'number',
      },
      {
        name: 'targetMax',
        text: '目标最大值',
        type: 'number',
      },
      {
        name: 'targetMin',
        text: '目标最小值',
        type: 'number',
      },
    ],
  },
];
