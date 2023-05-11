import { MComponent } from '@edoms/schema';

export interface QueryList {
  queryUnit: string;
  queryName: string;
  queryApi?: string;
  color: string;
  [key: string]: any;
}

export interface EqData {
  eqCode: string;
  eqName: string;
  pointList?: Array<QueryList>;
}

export interface EqAllList {
  key: string;
  equipmentList: Array<EqData>;
}

export interface EqDataList extends MComponent {
  /** 标题 */
  title: string;
  /** 子标题 */
  subTitle: string;
  /** 轮询间隔 */
  intervalDelay: number;
  /** 设备类型 */
  equipmentTypeList: Array<EqAllList>;
}
