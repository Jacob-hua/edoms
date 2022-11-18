export const enum ModelType {
  /** 静态模型 */
  STATIC = 0,
  /** 动态模型 */
  DYNAMIC = 1,
}

export const enum ModelCodeType {
  /** 系统 */
  SYS = 'sys',
  /** 设备 */
  DEV = 'dev',
}

export const enum ModelPropType {
  /** 固有属性 */
  INHERENT = 'inherent',
  /** 采集属性 */
  GATHER = 'gather',
  /** 计算属性 */
  CALCULATE = 'calculate',
}

export const enum ModelMark {
  CIM_TABLE = 'cim_table',
  CIM_URL = 'cim_url',
}

export const enum ModelTableActionType {
  /** 导入 */
  IMPORT = 0,
  /** 清空 */
  CLEAR = 1,
  /** 导出 */
  EXPORT = 2,
}
