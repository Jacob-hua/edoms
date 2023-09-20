// import { Request } from '@edoms/editor';

// import useInstanceConfig from '../../useInstanceConfig';
export default async () => [
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
  // {
  //   text: '设备类型',
  //   name: 'equipmentTypeList',
  //   type: 'groupList',
  //   labelWidth: '80px',
  //   addButtonText: '添加组',
  //   items: [
  //     {
  //       name: 'key',
  //       text: '类型名称',
  //       type: 'text',
  //       labelWidth: '80px',
  //     },

  //   ],
  // },
];
