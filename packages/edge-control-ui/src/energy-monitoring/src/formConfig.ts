/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-16 16:25:22
 */
import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
  {
    text: '标题',
    name: 'title',
    type: 'string',
  },
  {
    text: '子标题',
    name: 'subTitle',
    type: 'string',
  },
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
  /** 注入业务组件的共通字段 */
  ...(await useInstanceConfig(request, 'energy-monitoring')),
  {
    text: '最小值',
    name: 'minValue',
  },
  {
    text: '最大值',
    name: 'maxValue',
  },
  {
    type: 'number',
    name: 'bisectionNumber',
    text: '等分数量',
    min: 1,
    max: 12,
    step: 1,
    defaultValue: 11,
  },
  {
    text: '游标',
    type: 'colorPicker',
    name: 'cursorColor',
    defaultValue: '#008000',
  },
  {
    text: '较差',
    name: 'medium',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    maxItems: 1,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '最小值',
        name: 'minValue',
      },
      {
        text: '最大值',
        name: 'maxValue',
      },
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
        defaultValue: 'rgb(231, 106, 47,1)',
      },
    ],
  },
  {
    text: '优秀',
    name: 'excellent',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    maxItems: 1,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '最小值',
        name: 'minValue',
      },
      {
        text: '最大值',
        name: 'maxValue',
      },
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
        defaultValue: 'rgba(54, 167, 99,1)',
      },
    ],
  },
  {
    text: '参考值',
    name: 'reference',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    maxItems: 1,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '参考值',
        name: 'referenceValue',
      },
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
        defaultValue: 'rgba(255, 255, 255,1)',
      },
    ],
  },
];
