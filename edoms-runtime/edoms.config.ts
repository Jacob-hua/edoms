import path from 'path';

import { defineConfig } from '@edoms/cli';

export default defineConfig({
  packages: [path.join(__dirname, '../packages/shenneng-ui')],
  componentFileAffix: '.vue',
  dynamicImport: true,
});
