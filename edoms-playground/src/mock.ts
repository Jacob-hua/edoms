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
      title: '',
      style: {
        position: 'relative',
        left: 0,
        top: 0,
        right: '',
        bottom: '',
        width: '1000',
        height: '2728',
        backgroundImage: '',
        backgroundColor: 'rgba(248, 218, 218, 1)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      },
      children: [
        {
          id: 'text_01',
          type: 'text',
          name: 'text',
          text: '文本01',
          style: {
            position: 'absolute',
            width: '86.92',
            height: '37',
            left: '106.90',
            top: '35',
            right: '',
            bottom: '',
            backgroundImage: '',
            backgroundColor: '',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            color: '',
            fontSize: 24,
            fontWeight: '',
          },
        },
        {
          id: 'button_01',
          type: 'button',
          name: 'submitButton',
          text: '点击按钮打开弹窗',
          style: {
            position: 'absolute',
            width: '800',
            height: '200',
            backgroundColor: '#fb6f00',
            top: '506.82',
            left: '555.95',
            right: '',
            bottom: '',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          },
        },
      ],
    },
  ],
};

export default mockData;
