import { Request } from '@edoms/editor';

export default async (request: Request, componentName: string) => {
  const instances =
    (await request({
      resourceId: `${componentName}:instance`,
    })) ?? [];

  return [
    {
      name: 'instance',
      text: '实例',
      type: 'cascader',
      filterable: true,
      checkStrictly: true,
      options: instances,
      onChange: (mForm: any, value: any, { config, model }: any) => {
        model.instanceType = config.selectedOption?.type;
      },
    },
    {
      name: 'instanceType',
      text: '实例类型',
      type: 'hidden',
    },
    {
      name: 'propertyType',
      text: '属性类型',
      type: 'radio-group',
      options: [
        {
          text: '固有属性',
          value: 'inherent',
        },
        {
          text: '采集属性',
          value: 'gather',
        },
        {
          text: '计算属性',
          value: 'calculate',
        },
      ],
    },
    {
      name: 'property',
      text: '属性',
      type: 'select',
      options: async (mForm: any, { formValue, prop }: any) => {
        return (
          (await request({
            resourceId: `${componentName}:point`,
            formValue,
            prop,
          })) ?? []
        );
      },
      onChange: (mForm: any, value: any, { config, model }: any) => {
        model.unit = config.selectedOption?.unit;
      },
    },
    {
      name: 'unit',
      text: '单位',
      type: 'text',
    },
    {
      name: 'precision',
      text: '精度',
      type: 'select',
      options: [
        {
          text: '原始精度',
          value: '',
        },
        {
          text: '0',
          value: '0',
        },
        {
          text: '0.1',
          value: '0.1',
        },
        {
          text: '0.01',
          value: '0.01',
        },
        {
          text: '0.001',
          value: '0.001',
        },
        {
          text: '0.0001',
          value: '0.0001',
        },
        {
          text: '0.00001',
          value: '0.00001',
        },
        {
          text: '0.000001',
          value: '0.000001',
        },
        {
          text: '0.0000001',
          value: '0.0000001',
        },
        {
          text: '0.00000001',
          value: '0.00000001',
        },
      ],
    },
  ];
};
