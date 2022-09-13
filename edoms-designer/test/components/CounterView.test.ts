import { describe, test } from 'vitest'
import CounterView from '../../src/components/CounterView.vue'
import { mount } from '@vue/test-utils'

// 组件测试参考: https://v1.test-utils.vuejs.org/zh

describe('CounterView test', () => {
  test('increment test', async () => {
    const wrapper = mount(CounterView)
    // await wrapper.find('button:first-child').trigger('click')
    console.log('==================', wrapper)
  })
})
