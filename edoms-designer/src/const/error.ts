import { ElMessage } from 'element-plus';

export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class MessageError extends BaseError {
  constructor(message: string) {
    super(message);
    ElMessage.error(message);
  }
}
