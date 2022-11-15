import { Request } from '@edoms/editor';

export default async (request: Request) => {
  const instances =
    (await request({
      resourceId: 'dynamic-monitoring:instance',
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
            resourceId: 'dynamic-monitoring:point',
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
  ];
};
