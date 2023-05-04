import { MComponent } from '@edoms/schema';

export interface QueryList {
  queryUnit: string;
  queryName: string;
  queryApi?: string;
  [key: string]: any;
}

export interface EqData {
  eqCode: string;
  eqName: string;
  queryList?: Array<QueryList>;
}

export interface EqAllList {
  key: string;
  value: string;
  equipmentList: Array<EqData>;
}

export interface EqDataList extends MComponent {
  /** 轮询间隔 */
  intervalDelay: number;
  /** 设备类型 */
  equipmentTypeList: Array<EqAllList>;
}
