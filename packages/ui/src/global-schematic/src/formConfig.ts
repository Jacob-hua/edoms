import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
  {
    text: '轮询间隔',
    name: 'intervalDelay',
    type: 'number',
    min: 1000,
    step: 1000,
    defaultValue: 10000,
  },
  {
    text: '图片资源',
    name: 'src',
    type: 'upload',
    accepts: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.PNG', '.JPG', '.JPEG', '.GIF', '.WEBP'],
    upload: async (value: any) => {
      return await request({
        resourceId: 'global-schematic:upload',
        data: value,
      });
    },
  },
  /** 注入业务组件的共通字段 */
  ...(await useInstanceConfig(request, 'global-schematic')),
];
