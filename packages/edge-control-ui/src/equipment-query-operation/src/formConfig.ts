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
    text: '设备分组',
    name: 'deviceGroup',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加分组',
    items: [
      {
        name: 'group',
        text: '分组名称',
        type: 'text',
        labelWidth: '80px',
      },
      {
        text: '设备名称',
        name: 'nameGroup',
        type: 'groupList',
        labelWidth: '80px',
        addButtonText: '添加设备',
        items: [
          {
            name: 'deviceName',
            text: '设备名称',
            type: 'text',
            labelWidth: '80px',
          },
          {
            text: '检测指标',
            name: 'propGroup',
            type: 'groupList',
            labelWidth: '80px',
            addButtonText: '添加指标',
            items: [
              {
                name: 'label',
                text: '标签',
                type: 'text',
                labelWidth: '80px',
              },
              ...(await useInstanceConfig(request, 'equipment-query-operation')),
            ],
          },
        ],
      },
    ],
  },
];
