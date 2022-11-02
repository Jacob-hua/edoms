import { reactive } from 'vue';

import type { ComponentGroup, ComponentGroupState } from '../type';

import BaseService from './BaseService';

export class ComponentListService extends BaseService {
  private state = reactive<ComponentGroupState>({
    list: [],
  });

  constructor() {
    super([]);
  }

  /**
   * @param componentGroupList 组件列表配置
   */
  public setList(componentGroupList: ComponentGroup[]): void {
    this.state.list = componentGroupList;
  }

  public getList(): ComponentGroup[] {
    return this.state.list;
  }

  public destroy() {
    this.state.list = [];
    this.removeAllListeners();
  }
}

export default new ComponentListService();
