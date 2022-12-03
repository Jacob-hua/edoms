import modelApi, { InstanceItem, ListInstanceReq, ListPointReq, PointItem } from '@/api/model';

export interface InstanceOption {
  label: string;
  value: string;
  disable: boolean;
  type: string;
  children?: InstanceOption[];
}

function handleInstanceTree(instance: InstanceItem): InstanceOption {
  const result = {
    label: instance.insName,
    value: instance.insCode,
    disable: instance.disable,
    type: instance.type,
  } as InstanceOption;

  if (!instance.children) {
    return result;
  }

  const enableInstances = instance.children.filter((item) => item.disable);
  if (enableInstances.length === 0) {
    return result;
  }
  result.children = enableInstances.map((item) => handleInstanceTree(item));
  return result;
}

export default () => {
  const requestInstances = async (
    data: ListInstanceReq = {
      virtual: 'mixed',
      deviceCode: '',
      isQueryDevice: true,
    }
  ): Promise<InstanceOption[]> => {
    const instances = await modelApi.listInstance(data);
    return instances?.filter((instance) => instance.disable).map((instance) => handleInstanceTree(instance));
  };

  const requestPoints = async (data: ListPointReq) => {
    const pointCodes = await modelApi.listPointCode(data);
    return pointCodes?.map(({ label, value, unit }: PointItem) => ({ text: label, value, unit }));
  };

  return {
    requestInstances,
    requestPoints,
  };
};
