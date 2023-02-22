import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

const calculateTypes = [
  {
    text: '无',
    value: 'NONE',
  },
  {
    text: '环比',
    value: 'MOM',
  },
  {
    text: '同比',
    value: 'YOY',
  },
  {
    text: '全部',
    value: 'ALL',
  },
];

const options = [
  {
    label: '四则运算',
    value: [
      {
        label: '加(+)',
        value: 'x+y',
      },
      {
        label: '减(-)',
        value: 'x-y',
      },
      {
        label: '乘(*)',
        value: 'x*y',
      },
      {
        label: '除(/)',
        value: 'x/y',
      },
      {
        label: '取余(%)',
        value: 'x%y',
      },
    ],
  },
  {
    label: '三角函数',
    value: [
      {
        label: '圆周(Π)',
        value: 'pi',
      },
      {
        label: '正弦函数(sin)',
        value: 'sin(x)',
      },
      {
        label: '余弦函数(cos)',
        value: 'cos(x)',
      },
      {
        label: '正切函数(tan)',
        value: 'tan(x)',
      },
      {
        label: '余切函数(cot)',
        value: 'cot(x)',
      },
    ],
  },
  {
    label: '对数',
    value: [
      {
        label: 'log',
        value: 'log(x,y)',
      },
      {
        label: 'lg',
        value: 'lg(x)',
      },
      {
        label: 'ln',
        value: 'ln(x)',
      },
    ],
  },
  {
    label: '其他',
    value: [
      {
        label: '绝对值(|x|)',
        value: 'abs(x)',
      },
      {
        label: '阶乘(!)',
        value: 'x!',
      },
    ],
  },
];

export default async (request: Request) => {
  // const useInstance = await useInstanceConfig(request, 'system-cumulative-data');
  return [
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
      text: '类别',
      name: 'category',
      type: 'groupList',
      labelWidth: '80px',
      addButtonText: '添加类别',
      maxItems: 10,
      title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
      items: [
        {
          text: '类名',
          name: 'label',
          type: 'text',
          trim: true,
        },
        ...(await useInstanceConfig(request, 'system-cumulative-data')),
        {
          text: '变量',
          name: 'variables',
          type: 'groupList',
          labelWidth: '50px',
          addButtonText: '添加变量',
          maxItems: 10,
          title: (model: any, index: number | string) => `# ${index} ${model.variable ?? ''}`,
          items: [
            {
              text: '变量名',
              name: 'variable',
              type: 'text',
              defaultValue: '',
            },
            ...(await useInstanceConfig(request, 'system-cumulative-data')).slice(0, 5),
          ],
        },
        {
          text: '表达式',
          type: 'formula',
          name: 'expression',
          options: options,
          defaultValue: '',
        },
        {
          text: '计算方式',
          name: 'calculateType',
          type: 'select',
          options: calculateTypes,
        },
      ],
    },
  ];
};
