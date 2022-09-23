import { deepClone, getByPath, hasByPath, typeOf } from '../src/object'
import { describe, test, beforeEach, expect } from 'vitest'

interface Sample {
  name: string
  age: number
  interesting: string[]
  eat: Function
  skills: Function[]
  isStudent: boolean
  type: Symbol
  obj: Record<string, any>
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
      isStudent: true,
      type: Symbol('test'),
      obj: {
        a: [
          {
            b: {
              c: 3,
            },
          },
        ],
      },
    }
  })

  test<LocalContext>('typeOf', ({ sample }) => {
    expect(typeOf(sample.name, String)).toEqual(true)
    expect(typeOf(sample.age, Number)).toEqual(true)
    expect(typeOf(sample.interesting, Array)).toEqual(true)
    expect(typeOf(sample.eat, Function)).toEqual(true)
    expect(typeOf(sample.isStudent, Boolean)).toEqual(true)
    expect(typeOf(sample.type, Symbol)).toEqual(true)
  })

  test<LocalContext>('deepClone', ({ sample }) => {
    const cloneSample = deepClone<Sample>(sample)
    expect(cloneSample.name).toBe(sample.name)
    // cloneSample.eat('apple')
  })

  test<LocalContext>('getByPath', ({ sample }) => {
    const result1 = getByPath(sample, 'obj.a[0].b.c')
    expect(result1).toEqual(3)
    const result2 = getByPath(sample, 'obj.a[0].b.c.d', 2)
    expect(result2).toEqual(2)
  })

  test<LocalContext>('hasByPath', ({ sample }) => {
    const result1 = hasByPath(sample, 'obj.a[0].b.c')
    expect(result1).toEqual(true)
    const result2 = hasByPath(sample, 'obj.a[0].b.c.d')
    expect(result2).toEqual(false)
  })
})
