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

export default (request) => {
  const listInstance = async (): Promise<ListInstanceRes> => {
    try {
      const { result } = await request<any, ListInstanceRes>({
        url: '',
        method: RequestMethod.GET,
      });
      return result;
    } catch (error) {
      return {
        instances: [],
      };
    }
  };

  const listProperties = async (req: ListPropertiesReq): Promise<ListPropertiesRes> => {
    try {
      const { result } = await request<ListPropertiesReq, ListPropertiesRes>({
        url: '',
        method: RequestMethod.GET,
        data: {
          ...req,
        },
      });
      return result;
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
