import { EdApplication } from '@edoms/meta-model'

export const mockMeta = {
  id: 'app_0',
  type: 'app',
  name: '冷站监测系统',
  disabeld: false,
  pages: [
    {
      id: 'page_1',
      type: 'page',
      name: '首页',
      children: [
        {
          id: 'text_0',
          type: 'text',
          name: '文本',
          text: '可用1',
          disabledText: '禁用1~~~~~',
        },
        // {
        //   id: 'text_1',
        //   type: 'text',
        //   name: '文本',
        //   text: '可用2',
        //   disabledText: '禁用2~~~~~',
        // },
        // {
        //   id: 'button_2',
        //   type: 'button',
        //   name: '按钮',
        //   text: '文本不可用',
        //   actions: [
        //     {
        //       name: 'edoms:action:click',
        //       target: 'text_0',
        //       effect: 'disabled',
        //       props: [
        //         {
        //           argument: 'name',
        //           type: 'const',
        //           source: '3',
        //         },
        //       ],
        //     },
        //     {
        //       name: 'edoms:action:click',
        //       target: 'text_1',
        //       effect: 'disabled',
        //     },
        //   ],
        // },
        // {
        //   id: 'button_3',
        //   type: 'button',
        //   name: '按钮',
        //   text: '文本可用',
        //   actions: [
        //     {
        //       name: 'edoms:action:click',
        //       target: 'text_0',
        //       effect: 'enabled',
        //     },
        //     {
        //       name: 'edoms:action:click',
        //       target: 'text_1',
        //       effect: 'enabled',
        //     },
        //   ],
        // },
        {
          id: 'button_4',
          type: 'button',
          name: '按钮',
          text: '更新文本内容',
          actions: [
            {
              name: 'edoms:action:click',
              target: 'text_0',
              effect: 'updateText',
              props: [
                {
                  argument: 'text',
                  type: 'const',
                  source: '正常文字',
                },
                {
                  argument: 'disabledText',
                  type: 'const',
                  source: '失效文字',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} as EdApplication
