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
  // fetchProperties(request, componentName, formValue, prop)
  const instances = await fetchInstances(request, componentName);
  let pointList: any[] = [];
  return [
    {
      name: 'instance',
      text: '实例',
      type: 'cascader',
      filterable: true,
      checkStrictly: true,
      options: instances,
      display: () => !hiddenItems.includes('instance'),
      onChange: async (mForm: any, value: any, { model }: any) => {
        const modelInstance = getSelectedInstance(value, instances);
        pointList = [];
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
      onChange: async (mForm: any, value: any, { formValue, prop, model }: any) => {
        if (model.instance.length) {
          pointList = await fetchProperties(request, componentName, formValue, prop);
        }
        model.property = '';
        model.unit = '';
      },
      options: [
        {
          text: '基础属性',
          value: 'base',
        },
        {
          text: '静态属性',
          value: 'static',
        },
        {
          text: '动态属性',
          value: 'dynamic',
        },
      ],
    },
    {
      name: 'property',
      text: '点位',
      type: 'select',
      display: () => !hiddenItems.includes('property'),
      options: () => pointList,
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
