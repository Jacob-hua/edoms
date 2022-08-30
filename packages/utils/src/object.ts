import { cloneDeep, isEqual, isEqualWith } from 'loadsh'

export function deepClone<T>(obj: T): T {
  return cloneDeep(obj)
}

export function deepEqual<T, Q>(var1: T, var2: Q): boolean {
  return isEqual(var1, var2)
}

export function deepEqualWith<T, Q>(var1: T, var2: Q, customizer: Function): boolean {
  return isEqualWith(var1, var2, customizer)
}
