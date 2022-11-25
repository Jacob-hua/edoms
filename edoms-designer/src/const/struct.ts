export interface KVStruct {
  /** 键名 */
  key: string;
  /** 值 */
  value: string;
  /** 是否可以用 */
  isUse: string;
  /** 备注 */
  remark: string;
  [key: string]: any;
}

export interface PageStruct<T> {
  /** 页码 */
  page: number;
  /** 页面大小 */
  limit: number;
  /** 记录总数 */
  count: number;
  /** 数据列表 */
  dataList: T[];
}
