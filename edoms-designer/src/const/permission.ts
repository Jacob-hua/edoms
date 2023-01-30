export const ALL_PERMISSION = '*:*:*';
export const enum TenantModelPermission {
  //模型类型切换
  MODEL_CHANGE = 'design:model:type:change',
  // 静态模型清空表数据
  STATIC_CLEAR_TABLE = 'design:cim:clear',
  // 静态模型导出表数据
  STATIC_MODEL_IMPORT = 'design:cim:import',
  // 静态模型导出表数据
  STATIC_MODEL_EXPORT = 'design:cim:export',
  // 静态模型 导出操作记录
  STATIC_MODEL_RECORD = 'design:cim:record',
  // 动态模型保存
  DYNAMIC_MODEL_SAVE = 'design:model:save',
}

export const enum ApplicationPermission {
  // 新建应用
  APPLICATION_DESIGN_ADD = 'design:application:add',
  // 保存应用
  APPLICATION_DESIGN_UPDATE = 'design:application:update',
}
