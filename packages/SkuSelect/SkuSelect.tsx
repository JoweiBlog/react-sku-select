import { useCallback, useEffect, useState, useRef } from 'react'
import AttrSelect, { AttrOption } from './AttrSelect'

export interface SkuOption {
  id: number | string
  name: string
  options: AttrOption[]
  selected?: AttrOption['id']
}

export interface SkuAttrOption {
  attrId: SkuOption['id']
  valueId: AttrOption['id']
}

export interface SkuBase {
  attrs: SkuAttrOption[]
}

export interface SkuSelectProps<T extends SkuBase> {
  /** 属性选项集 */
  options: SkuOption[]
  /** sku列表 */
  skus: T[]
  value?: T
  /** 变更回调(value - 所匹配的sku, attrsSelected - 所选属性集合) */
  onChange?: (value?: T, attrsSelected?: SkuOption[]) => void
  /** 属性选项内容渲染 */
  renderAttrOption?: (option: AttrOption, options: SkuOption) => React.ReactNode
}

/** SKU选择 */
const SkuSelect = <T extends SkuBase>({
  options,
  skus,
  value,
  onChange,
  renderAttrOption,
}: SkuSelectProps<T>) => {
  const [attrs, setAttrs] = useState<SkuOption[]>([])
  const prevAttrs = useRef<SkuOption[]>([])

  const onAttrChange = useCallback(
    (current: SkuOption, attrValue?: AttrOption['id']) => {
      let result = prevAttrs.current.map((attr) =>
        current.id === attr.id ? { ...attr, selected: attrValue } : attr
      )
      result = formatAttrs(result, skus)
      setAttrs(result)
      onChange?.(getSku(skus, result), getAttrsSelected(result))
    },
    [skus, onChange]
  )

  const init = useCallback(() => {
    let res: SkuOption[] = options

    if (value) {
      const selected = (attr: SkuOption) =>
        value?.attrs.find((i) => i.attrId === attr.id)?.valueId
      res = res.map((attr) => ({ ...attr, selected: selected(attr) }))
    }

    setAttrs(formatAttrs(res, skus))
  }, [options, skus, value])

  useEffect(() => {
    // 缓存旧值：> 格式化更新；> 防止SkuSelect与父级同时render的异常；
    prevAttrs.current = attrs
  }, [attrs])

  useEffect(() => {
    init()
  }, [init])

  return (
    <div style={{ position: 'relative' }}>
      {attrs.map((option) => (
        <AttrSelect
          key={option.id}
          label={option.name}
          value={option.selected}
          options={option.options}
          onChange={(val) => onAttrChange(option, val)}
          renderOption={
            typeof renderAttrOption === 'function'
              ? (val) => renderAttrOption(val, option)
              : undefined
          }
        />
      ))}
    </div>
  )
}

export default SkuSelect

/**
 * 检查sku列表中是否有包含该属性值的sku
 * @param {SkuBase[]} skus - sku集合
 * @param {SkuOption["id"]} key - sku属性key
 * @param {AttrOption["id"]} value - sku属性value
 */
export function hasSku<T extends SkuBase>(
  skus: T[],
  key: SkuOption['id'],
  value: AttrOption['id']
) {
  return skus.some((sku) =>
    sku.attrs.some((v) => v.attrId === key && v.valueId === value)
  )
}

/**
 * 获取所选属性集
 */
function getAttrsSelected(attrs: SkuOption[]) {
  return attrs.filter((attr) => typeof attr.selected === 'number')
}

/**
 * 获取所匹配的sku
 */
function getSku<T extends SkuBase>(skus: T[], attrs: SkuOption[]) {
  return skus.find((sku) =>
    sku.attrs.every(
      (i) =>
        ~attrs.findIndex((j) => i.attrId === j.id && i.valueId === j.selected)
    )
  )
}

/**
 * 格式化属性结构
 */
function formatAttrs<T extends SkuBase>(
  attrs: SkuOption[],
  skus: T[]
): SkuOption[] {
  const attrsSelected = getAttrsSelected(attrs)

  return attrs.map((attr) => {
    const attrSelectedExceptSelf = attrsSelected.filter((i) => i.id !== attr.id)

    const skusValid =
      attrSelectedExceptSelf.length > 0
        ? skus.filter((sku) =>
            attrSelectedExceptSelf.every(
              (o) =>
                ~sku.attrs.findIndex(
                  (skuAttr) =>
                    skuAttr.attrId === o.id && skuAttr.valueId === o.selected
                )
            )
          )
        : skus

    return {
      ...attr,
      options: attr.options.map((value) => ({
        ...value,
        disabled: !hasSku(skusValid, attr.id, value.id),
      })),
    }
  })
}
