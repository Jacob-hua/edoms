import { Request } from '@edoms/editor';
import { RequestMethod } from '@edoms/utils';

interface Instance {
  label: string;
  code: string;
  children: Instance[];
}

interface ListInstanceRes {
  instances: Instance[];
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
  const listInstance = async (): Promise<ListInstanceRes> => {
    try {
      if (!requestFunc) {
        throw new Error();
      }
      const request = requestFunc<any, ListInstanceRes>();
      const { result } = await request({
        url: '',
        method: RequestMethod.GET,
      });
      return (
        result ?? {
          instances: [],
        }
      );
    } catch (error) {
      return {
        instances: [],
      };
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
