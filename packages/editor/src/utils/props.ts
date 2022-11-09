import { FormConfig, FormState } from '@edoms/form';

import editorService from '../services/editor';
import eventsService from '../services/events';

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
        labelWidth: '80px',
        items: [
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
        ],
      },
      {
        title: '样式',
        labelWidth: '80px',
        items: [
          {
            name: 'style',
            items: [
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
                    text: 'left',
                  },
                  {
                    name: 'top',
                    text: 'top',
                    disabled: (vm: FormState, { model }: any) =>
                      model.position === 'fixed' && model._edoms_position === 'fixedBottom',
                  },
                  {
                    name: 'right',
                    text: 'right',
                  },
                  {
                    name: 'bottom',
                    text: 'bottom',
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
                ],
              },
              {
                type: 'fieldset',
                legend: '背景',
                items: [
                  {
                    name: 'backgroundImage',
                    text: '背景图',
                  },
                  {
                    name: 'backgroundColor',
                    text: '背景颜色',
                    type: 'colorPicker',
                  },
                  {
                    name: 'backgroundRepeat',
                    text: '背景图重复',
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
                    text: '背景图大小',
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
                    text: '旋转角度',
                  },
                  {
                    name: 'scale',
                    text: '缩放',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: '事件',
        labelWidth: '80px',
        items: [
          {
            type: 'groupList',
            name: 'events',
            addButtonText: '添加事件',
            title: (model: any, index: number | string, formValue: any) => {
              const selectedEventOption = eventsService
                .getEvent(formValue.type)
                .find(({ value }) => value === model.name);
              const node = editorService.getNodeById(model.to);
              const selectedMethodOption = eventsService
                .getMethod(node?.type ?? '')
                .find(({ value }) => value === model.method);
              let title = `【${index}】`;
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
                name: 'to',
                text: '联动组件',
                type: 'ui-select',
              },
              {
                name: 'method',
                text: '组件动作',
                type: 'select',
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
                  const selectedOption = config
                    .options(mForm, { model })
                    .find(({ value: _v }: { value: string }) => _v === value);
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
                text: '动作参数',
                labelWidth: '80px',
                movable: false,
                titleKey: 'target',
                deletable: false,
                addable: false,
                display: (mForm: FormState, { model }: any) => {
                  const node = editorService.getNodeById(model.to);
                  if (!node?.type) return false;
                  const selectedMethodOption = eventsService
                    .getMethod(node.type)
                    .find(({ value }) => value === model.method);

                  return selectedMethodOption?.props;
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
            ],
          },
        ],
      },
      {
        title: '高级',
        lazy: true,
        items: [
          {
            name: 'created',
            text: 'created',
            type: 'code-select',
            labelWidth: '100px',
          },
          {
            name: 'mounted',
            text: 'mounted',
            type: 'code-select',
            labelWidth: '100px',
          },
        ],
      },
    ],
  },
];
