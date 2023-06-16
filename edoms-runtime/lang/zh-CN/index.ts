const modulesFiles = import.meta.glob(['./*.ts', '!./index.ts'], { import: 'default', eager: true });

const routers = Object.entries(modulesFiles).reduce(
  (routers, [key, value]) => ({ ...routers, [key.match(/\/([^/]+)\.[^.]+$/)?.[1] ?? '']: value }),
  {}
);

export default routers;
