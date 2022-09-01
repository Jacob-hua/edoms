import { deepClone } from '../object'
import { describe, test, beforeEach, expect } from 'vitest'

interface Sample {
  name: string
  age: number
  interesting: string[]
  eat: Function
  skills: Function[]
}

interface LocalContext {
  sample: Sample
}

describe('object', () => {
  beforeEach<LocalContext>(async (context) => {
    context.sample = {
      name: 'Tome',
      age: 12,
      interesting: ['java', 'js'],
      eat(food: string) {
        console.log(`Tome eats ${food}`)
      },
      skills: [
        function skill1() {
          console.log('skill1')
        },
        function skill2() {
          console.log('skill2')
        },
      ],
    }
  })

  test<LocalContext>('deepClone', ({ sample }) => {
    const cloneSample = deepClone<Sample>(sample)
    expect(cloneSample.name).toBe(sample.name)
    cloneSample.eat('apple')
  })
})
