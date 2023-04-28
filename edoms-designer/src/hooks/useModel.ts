import modelApi, { ListInstanceReq, ListInstanceResItem, ListPointReq, ListPointResItem } from '@/api/model';
import useAccountStore from '@/store/account';

const accountStore = useAccountStore();

export interface InstanceOption {
  label: string;
  value: string;
  disable: boolean;
  type: string;
  children?: InstanceOption[];
}

function handleInstanceTree(instance: ListInstanceResItem): InstanceOption {
  const result = {
    label: instance.insName,
    value: instance.insCode,
    // disable: true,
    type: instance.type,
  } as InstanceOption;

  if (!instance.children) {
    return result;
  }

  const enableInstances = instance.children;
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
      dataCode: accountStore.currentTenant?.tenantId ?? '',
    }
  ): Promise<InstanceOption[]> => {
    const instances = await modelApi.listInstance(data);
    // console.log(
    //   '2222222222222',
    //   instances?.map((instance) => handleInstanceTree(instance))
    //   // instances?.filter((instance) => instance.disable).map((instance) => handleInstanceTree(instance))
    // );
    return instances?.map((instance) => handleInstanceTree(instance));
  };

  const requestPoints = async (data: ListPointReq) => {
    const pointCodes = await modelApi.listPointCode(data);
    return pointCodes?.map(({ label, value, unit }: ListPointResItem) => ({ text: label, value, unit }));
  };

  return {
    requestInstances,
    requestPoints,
  };
};
