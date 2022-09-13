import { describe, test, vi, beforeEach } from 'vitest'
import CounterView from '../../src/components/CounterView.vue'
import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import { createPinia } from 'pinia'

// 组件测试参考: https://v1.test-utils.vuejs.org/zh

const app = createApp({
  expose: [],
})
describe('CounterView test', () => {
  beforeEach(() => {
    const pinia = createPinia()
    app.use(pinia)
  })

  test('increment test', async () => {
    const wrapper = mount(CounterView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    })
    console.log('========', wrapper.find('button'))
    // await wrapper.find('button:first-child').trigger('click')
  })
})
