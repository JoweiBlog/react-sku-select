import type { SkuBase } from '../packages/SkuSelect'

// 可以基于 SkuBase 扩展 SkuVo
export interface SkuVo extends SkuBase {
  id: number
  stock: number
  price: number
}

export const data = {
  skus: [
    {
      id: 1,
      stock: 12,
      price: 100,
      attrs: [
        { attrId: 1, valueId: 11 },
        { attrId: 2, valueId: 21 },
        { attrId: 3, valueId: 32 },
      ],
    },
    {
      id: 2,
      stock: 2,
      price: 50,
      attrs: [
        { attrId: 1, valueId: 12 },
        { attrId: 2, valueId: 23 },
        { attrId: 3, valueId: 31 },
      ],
    },
    {
      id: 3,
      stock: 50,
      price: 120,
      attrs: [
        { attrId: 1, valueId: 13 },
        { attrId: 2, valueId: 22 },
        { attrId: 3, valueId: 32 },
      ],
    },
  ],
  options: [
    {
      id: 1,
      name: '颜色',
      options: [
        { id: 11, name: '红色' },
        { id: 12, name: '黄色' },
        { id: 13, name: '蓝色' },
      ],
    },
    {
      id: 2,
      name: '尺寸',
      options: [
        { id: 21, name: 'S' },
        { id: 22, name: 'M' },
        { id: 23, name: 'L' },
      ],
    },
    {
      id: 3,
      name: '版型',
      options: [
        { id: 31, name: '长款' },
        { id: 32, name: '短款' },
      ],
    },
  ],
}
