export const log = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('edoms editor: ', ...args);
  }
};

export const info = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.info('edoms editor: ', ...args);
  }
};

export const warn = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn('edoms editor: ', ...args);
  }
};

export const debug = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug('edoms editor: ', ...args);
  }
};

export const error = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('edoms editor: ', ...args);
  }
};
