// import fs from 'fs'
// import path from 'path'

const fs = require('fs');

const path = require('path');

const rootPath = path.resolve(__dirname, `../`);

/**
 * 优化预加载依赖
 */
function optimizeDeps() {
  return {
    name: 'optimizeDeps',
    configResolved: (config) => {
      config.optimizeDeps.include = [];
      const concat = config.optimizeDeps.include.concat(optimizeElement());
      config.optimizeDeps.include = Array.from(new Set(concat));
      config.optimizeDeps.include.push(
        ...[
          'element-plus',
          'vue',
          '@gmct/editor',
          // 'qrcode',
          // '@element-plus/icons-vue',
          // 'katex',
          'element-plus/es/locale/lang/zh-cn',
          // 'lodash',
          // 'dayjs',
          // 'axios',
        ]
      );
      // console.log(config.optimizeDeps.include);
    },
  };
}

/**
 * 优化 element-plus
 */
function optimizeElement() {
  const includes = ['element-plus/es'];
  const folders = fs.readdirSync(path.resolve(rootPath, `./node_modules/element-plus/es/components`));
  // eslint-disable-next-line array-callback-return
  folders.map((name) => {
    const folderName = path.resolve(rootPath, `./node_modules/element-plus/es/components`, name);
    const stat = fs.lstatSync(folderName);
    if (stat.isDirectory()) {
      const styleFolder = path.resolve(folderName, 'style');
      if (fs.existsSync(styleFolder)) {
        const st = fs.lstatSync(styleFolder);
        if (st.isDirectory()) {
          includes.push(`element-plus/es/components/${name}/style/css`);
        }
      }
    }
  });
  return includes;
}

module.exports = optimizeDeps;
