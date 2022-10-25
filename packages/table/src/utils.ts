import { dateFormat } from '@edoms/utils';

import { ColumnConfig } from './schema';

export const formatter = (item: ColumnConfig, row: any) => {
  if (!item.prop) return '';

  if (item.formatter) {
    if (item.formatter === 'datetime') {
      // eslint-disable-next-line no-param-reassign
      item.formatter = (value: string) => dateFormat(value);
    }
    try {
      return item.formatter(row[item.prop], row);
    } catch (e) {
      return row[item.prop];
    }
  } else {
    return row[item.prop];
  }
};
