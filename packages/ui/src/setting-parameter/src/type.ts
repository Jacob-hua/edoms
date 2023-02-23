import { MComponent } from '@edoms/schema';

export interface Parameter {
  /** 参数名称 **/
  name: string;
  /** 参数值 **/
  value: string;
  /** 参数颜色 */
  valueColor: string;
  /** 参数单位 **/
  unit: string;
}

export interface MParameterConfig extends MComponent {
  /** 展示数量 */
  visibleNumber: number;
  /**参数列表 */
  parameters: Parameter[];
}

export interface FetchParametersReq {
  /**组件唯一标识列表 */
  list: string;
  /**应用ID */
  applicationId: string;
  /** 租户ID */
  tenantId: string;
}

export interface FetchParameters {
  /**组件类型 */
  componentType: string;
  /**组件唯一标识 */
  componentIdentify: string;
  /**参数列表 */
  dataSetting: Parameter[];
}

export interface UpdateParameterReq {
  /**组件类型 */
  componentType: string;
  /**组件唯一标识 */
  componentIdentify: string;
  /**参数列表 */
  dataSetting: Parameter[];
  /**应用ID */
  applicationId: string;
  /** 租户ID */
  tenantId: string;
}

export type UpdateParametersReq = UpdateParameterReq[];
export type FetchParametersRes = FetchParameters[];
export interface Apis {
  fetchParametersData: (data: FetchParametersReq) => Promise<FetchParametersRes>;
  updateParameterData: (data: UpdateParametersReq) => Promise<void>;
}
