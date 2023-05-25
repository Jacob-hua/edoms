import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request, uploadPreviewFile: string) => [
  {
    text: '轮询间隔',
    name: 'intervalDelay',
    type: 'number',
    min: 1,
    step: 1,
    defaultValue: 10,
    append: 's',
  },
  {
    text: '图片资源',
    name: 'src',
    type: 'upload',
    listType: 'picture',
    basePreviewUrl: uploadPreviewFile,
    accepts: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.PNG', '.JPG', '.JPEG', '.GIF', '.WEBP', '.svg'],
    upload: async (value: any, prop: string, mForm: any) => {
      return await request({
        resourceId: 'global-schematic:upload',
        data: value,
        prop,
        formValue: mForm.values,
      });
    },
  },
  {
    text: '监测点位',
    name: 'indicators',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加指标',
    maxItems: 10,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'label',
        text: '标签',
        type: 'text',
        trim: true,
      },
      /** 注入业务组件的共通字段 */
      ...(await useInstanceConfig(request, 'global-schematic')),
    ],
  },
];
