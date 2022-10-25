/**
 * @description 获取文件扩展名
 * @param fileName
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.match(/\.([0-9a-z]+)(?:[\\?#]|$)/i)![1] ?? '';
};
