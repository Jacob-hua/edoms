import { Request } from '@edoms/editor';

const fetchInstances = async (request: Request, componentName: string): Promise<any[]> =>
  (await request({
    resourceId: `${componentName}:instance`,
  })) ?? [];

const getSelectedInstance = (valuePath: string[], options: any[]): any => {
  let selectedOption;
  valuePath.forEach((value: string) => {
    selectedOption = options.find(({ value: optV }: any) => optV === value);
    options = selectedOption.children;
  });
  return selectedOption;
};

const fetchProperties = async (request: Request, componentName: string, formValue: any, prop: string): Promise<any[]> =>
  (await request({
    resourceId: `${componentName}:point`,
    formValue,
    prop,
  })) ?? [];

const getSelectedProperty = (value: string, options: any[]): any => {
  return options.find((item) => item.value === value);
};

export type InstanceItem = 'instance' | 'propertyType' | 'property' | 'unit' | 'precision';

export default async (request: Request, componentName: string, hiddenItems: InstanceItem[] = []) => {
  const instances = await fetchInstances(request, componentName);

  return [
    {
      name: 'instance',
      text: '实例',
      type: 'cascader',
      filterable: true,
      checkStrictly: true,
      options: instances,
      display: () => !hiddenItems.includes('instance'),
      onChange: (mForm: any, value: any, { model }: any) => {
        const modelInstance = getSelectedInstance(value, instances);
        model.instanceType = modelInstance?.type;
        model.instanceName = modelInstance?.label;
        model.propertyType = '';
        model.property = '';
        model.unit = '';
      },
    },
    {
      name: 'instanceType',
      text: '实例类型',
      type: 'hidden',
    },
    {
      name: 'instanceName',
      text: '实例名称',
      type: 'hidden',
    },
    {
      name: 'propertyType',
      text: '属性',
      type: 'radio-group',
      display: () => !hiddenItems.includes('propertyType'),
      onChange: (mForm: any, value: any, { model }: any) => {
        model.property = '';
        model.unit = '';
      },
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
      text: '点位',
      type: 'select',
      display: () => !hiddenItems.includes('property'),
      options: async (mForm: any, { formValue, prop }: any) => {
        return fetchProperties(request, componentName, formValue, prop);
      },
      onChange: async (mForm: any, value: any, { formValue, prop, model }: any) => {
        model.unit = getSelectedProperty(value, await fetchProperties(request, componentName, formValue, prop))?.unit;
      },
    },
    {
      name: 'unit',
      text: '单位',
      type: 'text',
      display: () => !hiddenItems.includes('unit'),
    },
    {
      name: 'precision',
      text: '精度',
      type: 'select',
      display: () => !hiddenItems.includes('precision'),
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
