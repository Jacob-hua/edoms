import { beforeEach, describe, expect, test } from 'vitest';
import Ids from '../src/ids';

interface LocalContext {
  ids: Ids;
}

describe('Ids测试', () => {
  beforeEach<LocalContext>((context) => {
    context.ids = new Ids({
      bits: 32,
      base: 36,
      expandBy: 1,
    });
  });

  test<LocalContext>('测试Id生成', ({ ids }) => {
    const id_1 = ids.next();
    console.log(id_1);
    expect(id_1.length).toEqual(7);
    const id_2 = ids.next();
    console.log(id_2);
    expect(id_2.length).toEqual(7);
    expect(id_1).not.toEqual(id_2);
  });
});
