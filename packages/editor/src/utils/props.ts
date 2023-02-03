import { FormConfig, FormState } from '@edoms/form';
import { EventAction, Id, MApp, NodeType } from '@edoms/schema';

import editorService from '../services/editor';
import eventsService from '../services/events';

const BorderStyleOptions = [
  {
    text: '无',
    value: 'none',
  },
  {
    text: '点线',
    value: 'dotted',
  },
  {
    text: '虚线',
    value: 'dashed',
  },
  {
    text: '实线',
    value: 'solid',
  },
  {
    text: '双实线',
    value: 'double',
  },
  {
    text: '雕刻',
    value: 'groove',
  },
  {
    text: '凹陷',
    value: 'inset',
  },
  {
    text: '突出',
    value: 'outset',
  },
];

const propertyConfig = (config: FormConfig = []) => [
  // 组件类型，必须要有
  {
    text: 'type',
    name: 'type',
    type: 'hidden',
  },
  // 组件id，必须要有
  {
    name: 'id',
    type: 'display',
    text: 'id',
  },
  {
    name: 'name',
    text: '组件名称',
  },
  ...config,
];

const styleConfig = () => [
  {
    name: 'style',
    items: [
      {
        name: 'visibility',
        text: '可见性',
        type: 'radio-group',
        display: (mForm: FormState, { model }: any) => {
          const node = editorService.getNodeById(model.id);
          return ![NodeType.PAGE, NodeType.ROOT].includes(node?.type as NodeType);
        },
        options: [
          {
            value: 'visible',
            text: '显示',
          },
          {
            value: 'hidden',
            text: '隐藏',
          },
        ],
      },
      {
        type: 'fieldset',
        legend: '位置',
        items: [
          {
            name: 'position',
            type: 'checkbox',
            activeValue: 'fixed',
            inactiveValue: 'absolute',
            defaultValue: 'absolute',
            text: '固定定位',
          },
          {
            name: 'left',
            text: '距左边',
          },
          {
            name: 'top',
            text: '距顶部',
            disabled: (vm: FormState, { model }: any) =>
              model.position === 'fixed' && model._edoms_position === 'fixedBottom',
          },
          {
            name: 'right',
            text: '距右边',
          },
          {
            name: 'bottom',
            text: '距底部',
            disabled: (vm: FormState, { model }: any) =>
              model.position === 'fixed' && model._edoms_position === 'fixedTop',
          },
        ],
      },
      {
        type: 'fieldset',
        legend: '盒子',
        items: [
          {
            name: 'width',
            text: '宽度',
          },
          {
            name: 'height',
            text: '高度',
          },
          {
            name: 'padding',
            text: '内间距',
          },
          {
            name: 'margin',
            text: '外间距',
          },
        ],
      },
      {
        type: 'fieldset',
        legend: '上边框',
        items: [
          {
            name: 'borderTopStyle',
            text: '样式',
            type: 'select',
            options: BorderStyleOptions,
          },
          {
            name: 'borderTopColor',
            text: '颜色',
            type: 'colorPicker',
          },
          {
            name: 'borderTopWidth',
            text: '宽度',
          },
          {
            name: 'borderTopLeftRadius',
            text: '左上圆角',
          },
          {
            name: 'borderTopRightRadius',
            text: '右上圆角',
          },
        ],
      },
      {
        type: 'fieldset',
        legend: '右边框',
        items: [
          {
            name: 'borderRightStyle',
            text: '样式',
            type: 'select',
            options: BorderStyleOptions,
          },
          {
            name: 'borderRightColor',
            text: '颜色',
            type: 'colorPicker',
          },
          {
            name: 'borderRightWidth',
            text: '宽度',
          },
        ],
      },
      {
        type: 'fieldset',
        legend: '下边框',
        items: [
          {
            name: 'borderBottomStyle',
            text: '样式',
            type: 'select',
            options: BorderStyleOptions,
          },
          {
            name: 'borderBottomColor',
            text: '颜色',
            type: 'colorPicker',
          },
          {
            name: 'borderBottomWidth',
            text: '宽度',
          },
          {
            name: 'borderBottomLeftRadius',
            text: '左下圆角',
          },
          {
            name: 'borderBottomRightRadius',
            text: '右下圆角',
          },
        ],
      },
      {
        type: 'fieldset',
        legend: '左边框',
        items: [
          {
            name: 'borderLeftStyle',
            text: '样式',
            type: 'select',
            options: BorderStyleOptions,
          },
          {
            name: 'borderLeftColor',
            text: '颜色',
            type: 'colorPicker',
          },
          {
            name: 'borderLeftWidth',
            text: '宽度',
          },
        ],
      },
      {
        type: 'fieldset',
        legend: '背景',
        items: [
          {
            name: 'backgroundImage',
            text: '图片',
          },
          {
            name: 'backgroundColor',
            text: '颜色',
            type: 'colorPicker',
          },
          {
            name: 'backgroundRepeat',
            text: '重复',
            type: 'select',
            defaultValue: 'no-repeat',
            options: [
              { text: 'repeat', value: 'repeat' },
              { text: 'repeat-x', value: 'repeat-x' },
              { text: 'repeat-y', value: 'repeat-y' },
              { text: 'no-repeat', value: 'no-repeat' },
              { text: 'inherit', value: 'inherit' },
            ],
          },
          {
            name: 'backgroundSize',
            text: '大小',
            defaultValue: '100% 100%',
          },
        ],
      },
      {
        type: 'fieldset',
        legend: '字体',
        items: [
          {
            name: 'color',
            text: '颜色',
            type: 'colorPicker',
          },
          {
            name: 'fontSize',
            text: '大小',
          },
          {
            name: 'fontWeight',
            text: '粗细',
          },
        ],
      },
      {
        type: 'fieldset',
        legend: '变形',
        name: 'transform',
        items: [
          {
            name: 'rotate',
            text: '旋转角',
          },
          {
            name: 'scale',
            text: '缩放',
          },
        ],
      },
    ],
  },
];

const eventCompLinkageConfig = () => [
  {
    name: 'to',
    text: '关联组件',
    type: 'ui-select',
    display: (mForm: FormState, { model }: any) => {
      return model.action === EventAction.COMPONENT_LINKAGE;
    },
  },
  {
    name: 'method',
    text: '组件方法',
    type: 'select',
    display: (mForm: FormState, { model }: any) => {
      return model.action === EventAction.COMPONENT_LINKAGE;
    },
    options: (mForm: FormState, { model }: any) => {
      const node = editorService.getNodeById(model.to);
      if (!node?.type) return [];

      return eventsService.getMethod(node.type).map((option) => ({
        text: option.label,
        value: option.value,
        props: option.props,
      }));
    },
    onChange: (mForm: FormState, value: any, { model, config }: any) => {
      const selectedOption = config.options(mForm, { model }).find(({ value: _v }: { value: string }) => _v === value);
      const props = selectedOption.props ?? [];
      model.mappings = props.reduce(
        (mappings: any[], prop: string) => [
          ...mappings,
          {
            target: prop,
            ignore: true,
          },
        ],
        []
      );
    },
  },
  {
    type: 'groupList',
    name: 'mappings',
    text: '方法参数',
    labelWidth: '70px',
    movable: false,
    titleKey: 'target',
    deletable: false,
    addable: false,
    display: (mForm: FormState, { model }: any) => {
      const node = editorService.getNodeById(model.to);
      if (!node?.type) return false;
      const selectedMethodOption = eventsService.getMethod(node.type).find(({ value }) => value === model.method);

      return selectedMethodOption?.props && model.action === EventAction.COMPONENT_LINKAGE;
    },
    items: [
      {
        text: '参数',
        name: 'target',
        type: 'display',
      },
      {
        text: '默认值',
        name: 'defaultValue',
      },
      {
        text: '忽略配置',
        name: 'ignore',
        type: 'switch',
      },
      {
        text: '取值空间',
        name: 'sourceSpace',
        type: 'select',
        display: (_: any, { model }: any) => !model.ignore,
        options: [
          {
            text: '事件',
            value: 'event',
          },
          {
            text: '应用',
            value: 'app',
          },
          {
            text: '页面',
            value: 'page',
          },
          {
            text: '组件',
            value: 'component',
          },
          {
            text: '表达式',
            value: 'expression',
          },
          {
            text: '模板',
            value: 'template',
          },
          {
            text: '常量',
            value: 'const',
          },
        ],
      },
      {
        text: '取值',
        name: 'source',
        display: (_: any, { model }: any) =>
          !model.ignore && ['event', 'app', 'page', 'component'].includes(model.sourceSpace),
      },
      {
        text: '常量',
        name: 'const',
        display: (_: any, { model }: any) => !model.ignore && model.sourceSpace === 'const',
      },
      {
        text: '表达式',
        name: 'expression',
        display: (_: any, { model }: any) => !model.ignore && model.sourceSpace === 'expression',
      },
      {
        text: '模板',
        name: 'template',
        display: (_: any, { model }: any) => !model.ignore && model.sourceSpace === 'template',
      },
    ],
  },
];

const eventRouteSetting = () => [
  {
    name: 'page',
    text: '目标页面',
    type: 'select',
    display: (mForm: FormState, { model }: any) => {
      return model.action === EventAction.ROUTE_SETTING;
    },
    options: () => {
      return editorService.get<MApp>('root').items.reduce(
        (options, item) => [
          ...options,
          {
            text: item.name,
            value: item.id,
          },
        ],
        [] as {
          text: string | undefined;
          value: Id;
        }[]
      );
    },
  },
];

const eventConfig = () => [
  {
    type: 'groupList',
    name: 'events',
    addButtonText: '添加事件',
    title: (model: any, index: number | string, formValue: any) => {
      const selectedEventOption = eventsService.getEvent(formValue.type).find(({ value }) => value === model.name);
      const node = editorService.getNodeById(model.to);
      const selectedMethodOption = eventsService
        .getMethod(node?.type ?? '')
        .find(({ value }) => value === model.method);
      let title = `# ${index}`;
      if (selectedEventOption?.label) {
        title = `${title} ${selectedEventOption?.label}`;
      }
      if (model.to) {
        title = `${title} ${model.to}`;
      }
      if (selectedMethodOption?.label) {
        title = `${title} ${selectedMethodOption.label}`;
      }
      return title;
    },
    items: [
      {
        name: 'name',
        text: '监听事件',
        type: 'select',
        options: (mForm: FormState, { formValue }: any) =>
          eventsService.getEvent(formValue.type).map((option) => ({
            text: option.label,
            value: option.value,
          })),
      },
      {
        name: 'action',
        text: '响应动作',
        type: 'select',
        options: [
          {
            text: '组件联动',
            value: 'component_linkage',
          },
          {
            text: '设置路由',
            value: 'route_setting',
          },
        ],
      },
      ...eventCompLinkageConfig(),
      ...eventRouteSetting(),
    ],
  },
];

/**
 * 统一为组件属性表单加上事件、高级、样式配置
 * @param config 组件属性配置
 * @returns Object
 */
export const fillConfig = (config: FormConfig = []) => [
  {
    type: 'tab',
    items: [
      {
        title: '属性',
        labelWidth: '70px',
        items: [...propertyConfig(config)],
      },
      {
        title: '样式',
        labelWidth: '70px',
        items: [...styleConfig()],
      },
      {
        title: '事件',
        labelWidth: '70px',
        items: [...eventConfig()],
      },
    ],
  },
];
