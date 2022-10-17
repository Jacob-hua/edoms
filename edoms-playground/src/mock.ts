import { EdApplication } from '@edoms/meta-model';

const mockData: EdApplication = {
  id: 'app_001',
  type: 'app',
  name: 'MockApplication',
  pages: [
    {
      id: 'page_001',
      type: 'page',
      name: 'index',
      children: [
        {
          id: 'text_01',
          type: 'text',
          name: 'text',
          text: '文本01',
        },
        {
          id: 'button_01',
          type: 'button',
          name: 'submitButton',
          text: '点击按钮打开弹窗',
        },
      ],
    },
  ],
};

export default mockData;
