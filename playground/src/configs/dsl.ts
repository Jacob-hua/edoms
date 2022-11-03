export default {
  id: '75f0extui9d7yksklx27hff8xg',
  name: 'test',
  type: 'app',
  codeBlocks: {
    code_5336: {
      name: 'getData',
      // eslint-disable-next-line no-eval
      content: eval(`(vm) => {\n  console.log("this is getData function")\n}`),
      comps: {
        page_299: ['mounted', 'created'],
      },
    },
    code_5316: {
      name: 'getList',
      // eslint-disable-next-line no-eval
      content: eval(`(vm) => {\n  console.log("this is getList function")\n}`),
      comps: {
        text_9027: ['created'],
        page_299: ['created'],
      },
    },
  },
  items: [
    {
      type: 'page',
      id: 'page_299',
      name: 'index',
      title: '',
      layout: 'absolute',
      style: {
        position: 'relative',
        left: 0,
        top: 0,
        right: '',
        bottom: '',
        width: '100%',
        height: '1728',
        backgroundImage: '',
        backgroundColor: 'rgba(248, 218, 218, 1)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        color: '',
        fontSize: '',
        fontWeight: '',
      },
      events: [],
      created: ['code_5316', 'code_5336'],
      mounted: ['code_5336'],
      items: [
        {
          type: 'text',
          id: 'text_9027',
          style: {
            width: '280.75',
            height: '38.97',
            position: 'absolute',
            top: '107.90',
            left: '46.96',
            right: '',
            bottom: '',
            backgroundImage: '',
            backgroundColor: '',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            color: '',
            fontSize: '20',
            fontWeight: '',
          },
          name: '文本',
          text: 'Edoms编辑器',
          multiple: true,
          events: [],
          created: ['code_5316'],
        },
        {
          type: 'button',
          id: 'button_43o',
          style: {
            position: 'absolute',
            width: '270',
            height: '37.5',
            border: 0,
            backgroundColor: '#fb6f00',
            top: '147',
            left: '59',
            right: '',
            bottom: '',
            backgroundImage: '',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            color: '',
            fontSize: '',
            fontWeight: '',
          },
          name: '按钮',
          text: '更新二维码',
          multiple: true,
          events: [
            {
              name: 'edoms:common:events:click',
              to: 'qrcode_4738',
              method: 'setQrcode',
              mappings: [
                {
                  target: 'url',
                  const: 'E-DOMS',
                },
              ],
            },
          ],
          created: [],
        },
        {
          type: 'qrcode',
          id: 'qrcode_4738',
          style: {
            position: 'absolute',
            left: '91.92',
            width: '176',
            height: '176',
            top: '565.50',
            right: '',
            bottom: '',
            backgroundImage: '',
            backgroundColor: '',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            color: '',
            fontSize: '',
            fontWeight: '',
          },
          name: '二维码',
          url: 'https://github.com/Tencent/edoms-editor',
          events: [],
          created: [],
        },
        {
          type: 'img',
          id: 'img_3877',
          style: {
            position: 'absolute',
            left: '95.91',
            width: '176',
            height: '176',
            top: '325.71',
            right: '',
            bottom: '',
            backgroundImage: '',
            backgroundColor: '',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            color: '',
            fontSize: '',
            fontWeight: '',
          },
          name: '图片',
          src: 'https://vfiles.gtimg.cn/vupload/20210811/388ed01628667545737.png',
          url: '',
          events: [],
          created: [],
        },
        {
          type: 'button',
          id: 'button_430',
          style: {
            position: 'absolute',
            width: '270',
            height: '37.5',
            border: 0,
            backgroundColor: '#fb6f00',
            top: '206.82',
            left: '55.95',
            right: '',
            bottom: '',
            backgroundImage: '',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            color: '',
            fontSize: '',
            fontWeight: '',
          },
          name: '按钮',
          text: '打开弹窗',
          multiple: true,
          events: [
            {
              name: 'edoms:common:events:click',
              to: 'overlay_2159',
              method: 'openOverlay',
            },
          ],
          created: [],
        },
        {
          type: 'overlay',
          id: 'overlay_2159',
          style: {
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
          name: '蒙层',
          items: [
            {
              type: 'container',
              id: 'container_607',
              style: {
                position: 'absolute',
                width: '80%',
                height: '400',
                top: '143.87',
                left: 37.5,
                right: '',
                bottom: '',
                backgroundImage: '',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
                color: '',
                fontSize: '',
                fontWeight: '',
              },
              name: '组',
              items: [
                {
                  type: 'button',
                  id: 'button_7265',
                  style: {
                    position: 'absolute',
                    width: '270',
                    height: '37.5',
                    border: 0,
                    backgroundColor: '#fb6f00',
                    top: '322.71',
                    left: '15.99',
                    right: '',
                    bottom: '',
                    backgroundImage: '',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    color: '',
                    fontSize: '',
                    fontWeight: '',
                  },
                  name: '按钮',
                  text: '关闭弹窗',
                  multiple: true,
                  events: [
                    {
                      name: 'edoms:common:events:click',
                      to: 'overlay_2159',
                      method: 'closeOverlay',
                    },
                  ],
                  created: [],
                },
                {
                  type: 'img',
                  id: 'img_3291',
                  style: {
                    position: 'absolute',
                    left: '63.94',
                    width: '176',
                    height: '176',
                    top: '105.91',
                  },
                  name: '图片',
                  src: 'https://puui.qpic.cn/vupload/0/1573555382625_bhp0wud8l6w.png/0',
                  url: '',
                },
                {
                  type: 'text',
                  id: 'text_8598',
                  style: {
                    position: 'absolute',
                    width: '86.92',
                    height: '37.97',
                    left: '106.90',
                    top: '35.97',
                    right: '',
                    bottom: '',
                    backgroundImage: '',
                    backgroundColor: '',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    color: '',
                    fontSize: '24',
                    fontWeight: '',
                  },
                  name: '文本',
                  text: 'Edoms',
                  multiple: false,
                  events: [],
                  created: [],
                },
              ],
              layout: 'absolute',
              events: [],
              created: [],
            },
          ],
        },
      ],
    },
  ],
};
