import { describe, test, beforeEach, expect } from 'vitest';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import CounterView from '../../src/components/CounterView.vue';
import { useCounterStore } from './../../src/store/counter';

// 组件测试参考: https://v1.test-utils.vuejs.org/zh

const app = createApp({
  expose: [],
});
describe('CounterView test', () => {
  beforeEach(() => {
    const pinia = createPinia();
    app.use(pinia);

    const counterStore = useCounterStore();
    counterStore.$patch({
      counter: 10,
    });
  });

  test('increment test', async () => {
    const wrapper = mount(CounterView);
    await wrapper.find('[test-increment]').trigger('click');
    expect(wrapper.find('span:nth-child(2)').element.innerHTML).toBe('11');
    await wrapper.find('[test-subtraction]').trigger('click');
    expect(wrapper.find('span:nth-child(2)').element.innerHTML).toBe('10');
  });
});
