import { cloneDeep, isEqual } from 'lodash'

export function typeOf(value: any, type: Function) {
  const functionNameReg = /(?<=(function )).*(?=(\())/g
  const valueTypeReg = /(?<=(\[object )).*(?=(\]))/g
  const functionNameMatch = (type.toString() ?? '').match(functionNameReg) ?? []
  const valueTypeMatch = (Object.prototype.toString.call(value) ?? '').match(valueTypeReg) ?? []
  return functionNameMatch[0] === valueTypeMatch[0]
}

export function deepClone<T>(obj: T): T {
  return cloneDeep(obj)
}

export function deepEqual<T, Q>(var1: T, var2: Q): boolean {
  return isEqual(var1, var2)
}
