import { Request } from '@edoms/editor';

export default async (request: Request, uploadPreviewFile: string) => [
  {
    text: '初始值',
    name: 'initValue',
    type: 'number',
    defaultValue: 3,
  },
  {
    text: '指示灯',
    name: 'lights',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加指示灯',
    maxItems: 5,
    title: (model: any, index: number | string) => `# ${index}`,
    items: [
      {
        text: '图片资源',
        name: 'src',
        type: 'upload',
        listType: 'picture',
        basePreviewUrl: uploadPreviewFile,
        accepts: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.PNG', '.JPG', '.JPEG', '.GIF', '.WEBP'],
        upload: async (value: any, prop: string, mForm: any) => {
          return await request({
            resourceId: 'multicolor-image-light:upload',
            data: value,
            prop,
            formValue: mForm.values,
          });
        },
      },
      {
        text: '最小值',
        type: 'number',
        name: 'minValue',
      },
      {
        text: '最大值',
        type: 'number',
        name: 'maxValue',
      },
    ],
  },
];
