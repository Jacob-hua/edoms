export interface ThrottleWrapper {
  (...args: any[]): void;
  cancel: () => void;
}

export interface DebounceWrapper {
  (...args: any[]): void;
}
