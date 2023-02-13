/**
 * @description 获取文件扩展名
 * @param fileName
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.match(/\.([0-9a-z]+)(?:[\\?#]|$)/i)![1] ?? '';
};

/**
 * 选择文件
 *
 * @param accepts
 * @param multiple
 * @returns
 */
export const selectFile = (accepts: string[] = ['*'], multiple: boolean = false): Promise<File[]> => {
  if (!globalThis.document || !(globalThis.document instanceof Document)) {
    throw new Error('This is not a browser environment');
  }
  const inputElem = globalThis.document.createElement('input');
  inputElem.setAttribute('type', 'file');
  inputElem.setAttribute('visibility', 'hidden');
  if (Array.isArray(accepts) && accepts.length > 0) {
    inputElem.setAttribute('accept', accepts.join(','));
  }
  if (multiple) {
    inputElem.setAttribute('multiple', 'true');
  }
  inputElem.click();
  return new Promise((resolve, reject) => {
    globalThis.addEventListener(
      'focus',
      () => {
        setTimeout(() => {
          if (!inputElem.files || inputElem.files?.length == 0) {
            reject({
              type: 'CancelSelect',
            });
          }
        }, 0);
      },
      { once: true }
    );
    inputElem.addEventListener('change', () => {
      if (!inputElem.files || inputElem.files?.length == 0) {
        reject({
          type: 'CancelSelect',
        });
      } else {
        const fileList = Array.from(inputElem.files);
        if (!accepts.includes('*') && fileList.some(({ name }) => !accepts.includes(`.${name.split('.').pop()}`))) {
          reject({
            message: `Please select files in ${accepts} format`,
            type: 'WrongFormat',
            accepts,
          });
        }
        resolve(fileList);
      }
    });
  });
};
