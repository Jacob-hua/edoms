import { Moment } from 'moment'

export interface MomentRange {
  start: Moment
  end: Moment
}

export interface FormatDateRange {
  start: string
  end: string
}

export interface DateRange {
  start: Date | number
  end: Date | number
  isTimestamp?: boolean
}
