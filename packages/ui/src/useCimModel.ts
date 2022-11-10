import { Request } from '@edoms/editor';
import { RequestMethod } from '@edoms/utils';

interface Instance {
  label?: string;
  value?: string;
  insCode?: string;
  insName?: string;
  children: Instance[];
}

interface Property {
  label: string;
  code: string;
  unit: string;
}

interface ListPropertiesReq {
  instance: string;
  instanceType: string;
  propertyType: string;
}

interface ListPropertiesRes {
  properties: Property[];
}

export default (requestFunc?: <D, R>() => Request<D, R>) => {
  const listInstance = async (): Promise<Instance[]> => {
    try {
      if (!requestFunc) {
        throw new Error();
      }
      const request = requestFunc<any, Instance[]>();
      const { result } = await request({
        url: '/common/cimEnergy/system-device-tree',
        method: RequestMethod.POST,
        data: {
          virtual: 'mixed',
          deviceCode: '',
          isQueryDevice: true,
        },
      });
      const instances = result ?? [];
      console.log(
        '~~~~~',
        instances.map((instance) => handleInstanceTree(instance))
      );

      return instances;
    } catch (error) {
      return [];
    }

    function handleInstanceTree(instance: Instance) {
      const result = {
        label: instance.insName,
        value: instance.insCode,
      } as {
        label: string;
        value: string;
        children?: any[];
      };

      if (instance.children) {
        result.children = instance.children.map((item) => handleInstanceTree(item));
      }

      return result;
    }
  };

  const listProperties = async (req: ListPropertiesReq): Promise<ListPropertiesRes> => {
    try {
      if (!requestFunc) {
        throw new Error();
      }
      const request = requestFunc<ListPropertiesReq, ListPropertiesRes>();
      const { result } = await request({
        url: '',
        method: RequestMethod.GET,
        data: {
          ...req,
        },
      });
      return (
        result ?? {
          properties: [],
        }
      );
    } catch (error) {
      return {
        properties: [],
      };
    }
  };
  return {
    listInstance,
    listProperties,
  };
};
