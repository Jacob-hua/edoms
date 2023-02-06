import { MComponent } from '@edoms/schema';

export interface TimeWeatherConfig extends MComponent {
  intervalDelay: number;
}

export interface CurrentDate {
  /**日期 */
  realDate: string;
  /**时间 */
  realTime: string;
  /**星期 */
  realWeek: string;
}

export interface GetWeatherRes {
  /**时间 */
  time: string;
  /**天气 */
  condition: string;
  /**温度 */
  temp: string;
  /**风力 */
  windLevel: string;
}

export interface Apis {
  getWeather: () => Promise<GetWeatherRes>;
}
