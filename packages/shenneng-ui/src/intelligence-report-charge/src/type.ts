/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-27 10:04:26
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-27 10:36:24
 */
import { MComponent } from '@edoms/schema';

export interface OperationsAnalysisPv extends MComponent {
  /**轮询间隔时间 */
  intervalDelay: number;
  /** 标题 */
  title: string;
}
