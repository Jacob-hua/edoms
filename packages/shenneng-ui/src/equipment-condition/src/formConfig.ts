import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
  {
    text: '标题',
    name: 'title',
    type: 'text',
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
    name: 'groups',
    type: 'table',
    enableFullscreen: false,
    fixed: false,
    enableToggleMode: false,
    items: [
      {
        label: '分组',
        name: 'group',
        text: '分组',
        type: 'text',
      },
    ],
  },
  {
    text: '设备工况',
    name: 'conditions',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加设备',
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'label',
        text: '设备',
        type: 'text',
      },
      {
        name: 'group',
        text: '归属组',
        type: 'select',
        options: (mForm: any, { formValue }: any) =>
          formValue.groups.map(({ group }: any) => ({
            text: group,
            value: group,
          })) ?? [],
      },
      {
        name: 'lineColor',
        text: '曲线颜色',
        type: 'colorPicker',
      },
      {
        name: 'color',
        text: '数值颜色',
        type: 'colorPicker',
      },
      {
        text: '参数',
        name: 'indicators',
        type: 'groupList',
        labelWidth: '50px',
        addButtonText: '添加参数',
        title: (model: any, index: number | string) => `# ${index}`,
        items: [
          {
            name: 'label',
            text: '标签',
            type: 'text',
          },
          ...(await useInstanceConfig(request, 'equipment-condition')),
        ],
      },
    ],
  },
];
