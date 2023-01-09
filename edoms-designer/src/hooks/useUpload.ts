import { ref, watch } from 'vue';
import Crypto from 'crypto-js';

import fileApi from '@/api/file';
import { MessageError } from '@/const/error';

export interface FileChunk {
  fileName: string;
  fileType: string;
  fileChunk: Blob;
  chunkIndex: number;
  chunkSize: number;
  chunks: number;
}

export interface FileReadResult {
  fileChunks: FileChunk[];
  md5: string;
  uid: string;
}

export class UploadError extends MessageError {
  constructor(fileName: string, cause?: any) {
    super(`${fileName}上传失败`);
    this.cause = cause;
  }
}

const chunkSize = 1024 * 1024;

export default () => {
  const loading = ref<boolean>(false);

  const error = ref<UploadError>();

  const progress = ref<number>(0);

  watch(
    () => progress.value,
    () => {
      console.log('当前进度', progress.value);
    }
  );

  const execute = async (
    content: File | Blob | string,
    fileName: string,
    fileType: string,
    charset?: string,
    referenceIds?: string
  ): Promise<string> => {
    if (typeof content === 'string') {
      content = new Blob([content], { type: `${fileType};charset=${charset}` });
    }
    loading.value = true;
    const { fileChunks, md5, uid } = await readFile(content, fileName, fileType);
    try {
      const uploadRequests = fileChunks.map(async ({ chunkIndex, chunks, fileChunk, fileName, fileType }) => {
        const uploadResult = await fileApi.uploadFile({
          file: fileChunk,
          fileName,
          fileType,
          chunkIndex,
          chunkSize: chunks,
          uid,
        });
        progress.value = uploadResult.progress;
      });
      await Promise.all(uploadRequests);
      const confirmResult = await fileApi.uploadConfirm({
        finished: true,
        fileName,
        fileType,
        uid,
        md5,
        referenceIds,
      });
      progress.value = confirmResult.progress;
      return confirmResult.contentId;
    } catch (e) {
      error.value = new UploadError(fileName, e);
      fileApi.uploadConfirm({
        finished: false,
        fileName,
        fileType,
        uid,
        md5,
        referenceIds,
      });
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  function readFile(file: File | Blob, fileName: string, fileType: string): Promise<FileReadResult> {
    const fileChunks: FileChunk[] = [];
    return new Promise((resolve, reject) => {
      const chunks = Math.ceil(file.size / chunkSize);
      let chunkIndex = 0;
      const MD5 = Crypto.algo.MD5.create();
      let start = chunkIndex * chunkSize;
      let end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      let fileChunk = fileSlice(file, start, end);

      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(fileChunk);
      fileReader.onload = (event: ProgressEvent<FileReader>): void => {
        const fileContent = event.target?.result;
        if (!fileContent) {
          reject();
          return;
        }
        const wordArray = arrayBuffer2WordArray(fileContent);
        MD5.update(wordArray);
        fileChunks.push({
          fileName,
          fileType,
          chunkIndex,
          chunkSize,
          chunks,
          fileChunk,
        });
        chunkIndex++;
        if (chunkIndex < chunks) {
          start = chunkIndex * chunkSize;
          end = start + chunkSize >= file.size ? file.size : start + chunkSize;
          fileChunk = fileSlice(file, start, end);
          fileReader.readAsArrayBuffer(File.prototype.slice.call(file, start, end));
        } else {
          resolve({
            fileChunks,
            md5: MD5.finalize().toString(),
            uid: URL.createObjectURL(new Blob()).slice(-36),
          });
        }
      };
    });
  }

  function fileSlice(file: File | Blob, start: number, end: number): Blob {
    return File.prototype.slice.call(file, start, end);
  }

  function arrayBuffer2WordArray(arrayBuffer: ArrayBuffer | string): Crypto.lib.WordArray {
    if (typeof arrayBuffer === 'string') {
      arrayBuffer = string2ArrayBuffer(arrayBuffer);
    }
    const i8Array = new Uint8Array(arrayBuffer);
    const array = [];
    for (let i = 0; i < i8Array.length; i += 4) {
      array.push((i8Array[i] << 24) | (i8Array[i + 1] << 16) | (i8Array[i + 2] << 8) | i8Array[i + 3]);
    }
    return Crypto.lib.WordArray.create(array, i8Array.length);
  }

  function string2ArrayBuffer(str: string): ArrayBuffer {
    const result = new ArrayBuffer(str.length * 2);
    const i16Array = new Uint16Array(result);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      i16Array[i] = str.charCodeAt(i);
    }
    return result;
  }

  return {
    execute,
    loading,
    progress,
    error,
  };
};
