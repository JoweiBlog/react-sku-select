import { useCallback, ReactNode } from 'react'

/** sku 属性选项结构 */
export interface AttrOption {
  id: number | string
  name: string
  disabled?: boolean
}

export interface AttrSelectProp {
  label: string
  value?: AttrOption['id']
  onChange?: (value?: AttrOption['id']) => void
  options: AttrOption[]
  renderOption?: (option: AttrOption) => ReactNode
}

/** 属性选择 */
const AttrSelect = ({
  label,
  onChange,
  options,
  value,
  renderOption,
}: AttrSelectProp) => {
  const exSelect = useCallback(
    (item: AttrOption) => {
      if (item.disabled) return
      onChange?.(value === item.id ? undefined : item.id)
    },
    [onChange, value]
  )

  return (
    <div className="sku-attr">
      <h4>{label}</h4>
      <div className="sku-attr__options">
        {options.map((option) => (
          <div
            key={option.id}
            className="sku-attr__option"
            onClick={() => exSelect(option)}
          >
            {typeof renderOption === 'function' ? (
              renderOption(option)
            ) : (
              <div
                className={[
                  'sku-attr__value',
                  option.disabled ? 'sku-attr__value--disabled' : '',
                  value === option.id ? 'sku-attr__value--active' : '',
                ].join(' ')}
              >
                {option.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AttrSelect
