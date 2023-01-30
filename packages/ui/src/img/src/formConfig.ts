import { Request } from '@edoms/editor';

export default (request: Request) => [
  {
    text: '图片资源',
    name: 'src',
    type: 'upload',
    listType: 'picture',
    basePreviewUrl: 'http://k8s.isiact.com/edoms-designtime-service-dev/edoms/design-time/file/preview/?contentId=',
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
