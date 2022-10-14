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
      ],
    },
  ],
};

export default mockData;
