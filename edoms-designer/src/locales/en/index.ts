const modulesFiles = import.meta.glob(['./*.ts', '!./index.ts'], { import: 'default', eager: true });

export const locales = Object.entries(modulesFiles).reduce(
  (locales, [key, value]) => ({ ...locales, [key.match(/\/([^/]+)\.[^.]+$/)?.[1] ?? '']: value }),
  {}
);

export default locales;
