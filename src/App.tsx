import { useState } from 'react'
import SkuSelect, { SkuOption } from '../packages/SkuSelect'
import { data, SkuVo } from './mock'

function App() {
  return (
    <div className="app">
      <Demo1 />
      <Demo2 />
    </div>
  )
}

export default App

const Demo1 = () => {
  const [sku, setSku] = useState<SkuVo>()

  return (
    <div>
      <h2>基础用法</h2>

      <SkuSelect<SkuVo>
        options={data.options}
        skus={data.skus}
        onChange={setSku}
      />

      <h4>
        所选sku:{' '}
        {sku ? `id: ${sku?.id}, 库存:${sku?.stock}, 价格: ${sku?.price}` : ''}
      </h4>
    </div>
  )
}

const Demo2 = () => {
  const [sku, setSku] = useState<SkuVo>()
  const [attrs, setAttrs] = useState<SkuOption[]>([])

  return (
    <div>
      <h2>自定义禁用规则</h2>

      <SkuSelect<SkuVo>
        options={data.options}
        skus={data.skus}
        onChange={(sku, attrs) => {
          setSku(sku)
          setAttrs(attrs || [])
        }}
      />

      <h4>attrs selected</h4>
      {attrs.length > 0 && (
        <p>
          {attrs.map((i) => (
            <div>
              {i.name} : {i.selected}
            </div>
          ))}
        </p>
      )}
      <h4>sku</h4>
      {sku && (
        <p>
          id: {sku?.id}, 库存: {sku?.stock}, 价格: {sku?.price}
        </p>
      )}
    </div>
  )
}
