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
    text: '设备类型',
    name: 'equipmentTypes',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加类型',
    maxItems: 4,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'label',
        text: '类型',
        type: 'text',
        trim: true,
      },
      {
        text: '设备列表',
        name: 'equipments',
        type: 'groupList',
        labelWidth: '60px',
        addButtonText: '添加设备',
        maxItems: 10,
        title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
        items: [
          {
            name: 'label',
            text: '设备名',
            type: 'text',
            trim: true,
          },
          (await useInstanceConfig(request, 'equipment-operating-parameter'))[0],
          {
            text: '参数',
            name: 'parameters',
            type: 'groupList',
            labelWidth: '50px',
            addButtonText: '添加参数',
            maxItems: 6,
            title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
            items: [
              {
                name: 'label',
                text: '参数名',
                type: 'text',
                trim: true,
              },
              ...(await useInstanceConfig(request, 'equipment-operating-parameter')),
            ],
          },
        ],
      },
    ],
  },
];
