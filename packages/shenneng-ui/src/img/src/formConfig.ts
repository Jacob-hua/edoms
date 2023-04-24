import { Request } from '@edoms/editor';

export default (request: Request, uploadPreviewFile: string) => [
  {
    text: '图片资源',
    name: 'src',
    type: 'upload',
    listType: 'picture',
    basePreviewUrl: uploadPreviewFile,
    accepts: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.PNG', '.JPG', '.JPEG', '.GIF', '.WEBP'],
    upload: async (value: any, prop: string, mForm: any) => {
      return await request({
        resourceId: 'global-schematic:upload',
        data: value,
        prop,
        formValue: mForm.values,
      });
    },
  },
];
