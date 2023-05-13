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
    text: '标题',
    name: 'title',
    type: 'string',
  },
  {
    text: '设备分类',
    name: 'calculateType',
    type: 'select',
    options: [
      {
        text: '变压器',
        value: 'byq',
      },
      {
        text: '冷站',
        value: 'lz',
      },
    ],
  },
  {
    text: '设备',
    name: 'equipmentList',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加设备',
    items: [
      {
        name: 'key',
        text: '设备名称',
        type: 'text',
      },
      ...(await useInstanceConfig(request, 'operations-analysis')),
      {
        name: 'unitList',
        text: '单元',
        type: 'groupList',
        enableFullscreen: false,
        fixed: false,
        items: [
          {
            label: '单元名称',
            name: 'unitName',
            text: '单元名称',
            type: 'text',
          },
          ...(await useInstanceConfig(request, 'operations-analysis')),
        ],
      },
    ],
  },
];
