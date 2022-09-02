import moment, { unitOfTime, MomentInput } from 'moment'
import { DateRange, FormatDateRange, MomentRange } from './type'

export function stringToDate(format: string) {
  return moment(format).toDate()
}

export function stringToTimestamp(format: string) {
  return moment(format).valueOf()
}

export function formatDate(date: MomentInput, format: string): string {
  return moment(date).format(format)
}

export function momentRange(date: MomentInput, unitOfTime: unitOfTime.StartOf): MomentRange {
  return {
    start: moment(date).startOf(unitOfTime),
    end: moment(date).endOf(unitOfTime),
  }
}

export function formatDateRange(date: MomentInput, unitOfTime: unitOfTime.StartOf, format: string): FormatDateRange {
  const { start, end } = momentRange(date, unitOfTime)
  return {
    start: start.format(format),
    end: end.format(format),
  }
}

export function formatCurrentDateRange(unitOfTime: unitOfTime.StartOf, format: string): FormatDateRange {
  return formatDateRange(new Date(), unitOfTime, format)
}

export function formatTodayRange(format: string): FormatDateRange {
  return formatCurrentDateRange('day', format)
}

export function formatThisMonthRange(format: string): FormatDateRange {
  return formatCurrentDateRange('month', format)
}

export function formatThisYearRange(format: string): FormatDateRange {
  return formatCurrentDateRange('year', format)
}

export function formatThisIsoWeekRange(format: string): FormatDateRange {
  return formatCurrentDateRange('isoWeek', format)
}

export function formatThisWeekRange(format: string): FormatDateRange {
  return formatCurrentDateRange('week', format)
}

export function dateRange(date: moment.MomentInput, unitOfTime: unitOfTime.StartOf, isTimestamp: boolean): DateRange {
  const { start, end } = momentRange(date, unitOfTime)
  if (isTimestamp) {
    return {
      start: start.valueOf(),
      end: end.valueOf(),
      isTimestamp,
    }
  }
  return {
    start: start.toDate(),
    end: end.toDate(),
  }
}

export function currentDateRange(unitOfTime: unitOfTime.StartOf, isTimestamp: boolean): DateRange {
  return dateRange(new Date(), unitOfTime, isTimestamp)
}

export function todayRange(isTimestamp: boolean): DateRange {
  return currentDateRange('day', isTimestamp)
}

export function thisMonthRange(isTimestamp: boolean): DateRange {
  return currentDateRange('month', isTimestamp)
}

export function thisYearRange(isTimestamp: boolean): DateRange {
  return currentDateRange('year', isTimestamp)
}

export function thisIsoWeekRange(isTimestamp: boolean): DateRange {
  return currentDateRange('isoWeek', isTimestamp)
}

export function thisWeekRange(isTimestamp: boolean): DateRange {
  return currentDateRange('week', isTimestamp)
}

export function daysInMonth(date: MomentInput) {
  return moment(date).daysInMonth()
}

export function daysInThisMonth() {
  return moment().daysInMonth()
}
