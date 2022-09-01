import { cloneDeep, isEqual } from 'lodash'

export function deepClone<T>(obj: T): T {
  return cloneDeep(obj)
}

export function deepEqual<T, Q>(var1: T, var2: Q): boolean {
  return isEqual(var1, var2)
}
