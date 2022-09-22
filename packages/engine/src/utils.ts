export const isCommResponse = (responseName: string): boolean => responseName.startsWith('edom-common:')

const EDOMS_ACTION_PREFIX = 'edoms:action:'

export const generateEventName = (actionName: string, comId: string): string => {
  const result = `${actionName}:${comId}`
  if (result.startsWith(EDOMS_ACTION_PREFIX)) {
    return result
  }
  return `${EDOMS_ACTION_PREFIX}:${result}`
}
