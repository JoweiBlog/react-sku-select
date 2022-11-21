import { jsxs, jsx } from 'react/jsx-runtime';
import { useCallback, useState, useRef, useEffect } from 'react';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".sku-attr + .sku-attr {\n  margin-top: 8px;\n}\n.sku-attr h4 {\n  font-size: 14px;\n  font-weight: 500;\n  color: #181818;\n  line-height: 20px;\n  margin: 0;\n  margin-bottom: 12px;\n}\n.sku-attr__options {\n  display: flex;\n  flex-flow: wrap;\n  position: relative;\n}\n.sku-attr__option {\n  position: relative;\n  display: inline-block;\n  min-width: 0;\n  margin-bottom: 16px;\n}\n.sku-attr__option:not(:last-child) {\n  margin-right: 16px;\n}\n.sku-attr__value {\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 16px;\n  position: relative;\n  padding: 8px 20px;\n  background: #f5f5f5;\n  color: #181818;\n  border-radius: 4px;\n  min-width: 0;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  cursor: pointer;\n}\n.sku-attr__value--active {\n  background: #181818;\n  color: #fbfbfb;\n}\n.sku-attr__value--disabled {\n  color: #d4d4d4;\n  cursor: not-allowed;\n}";
styleInject(css_248z);

/** 属性选择 */
const AttrSelect = ({ label, onChange, options, value, renderOption, }) => {
    const exSelect = useCallback((item) => {
        if (item.disabled)
            return;
        onChange?.(value === item.id ? undefined : item.id);
    }, [onChange, value]);
    return (jsxs("div", { className: "sku-attr", children: [jsx("h4", { children: label }), jsx("div", { className: "sku-attr__options", children: options.map((option) => (jsx("div", { className: "sku-attr__option", onClick: () => exSelect(option), children: typeof renderOption === 'function' ? (renderOption(option)) : (jsx("div", { className: [
                            'sku-attr__value',
                            option.disabled ? 'sku-attr__value--disabled' : '',
                            value === option.id ? 'sku-attr__value--active' : '',
                        ].join(' '), children: option.name })) }, option.id))) })] }));
};

/** SKU选择 */
const SkuSelect = ({ options, skus, value, onChange, renderAttrOption, }) => {
    const [attrs, setAttrs] = useState([]);
    const prevAttrs = useRef([]);
    const onAttrChange = useCallback((current, attrValue) => {
        let result = prevAttrs.current.map((attr) => current.id === attr.id ? { ...attr, selected: attrValue } : attr);
        result = formatAttrs(result, skus);
        setAttrs(result);
        onChange?.(getSku(skus, result), getAttrsSelected(result));
    }, [skus, onChange]);
    const init = useCallback(() => {
        let res = options;
        if (value) {
            const selected = (attr) => value?.attrs.find((i) => i.attrId === attr.id)?.valueId;
            res = res.map((attr) => ({ ...attr, selected: selected(attr) }));
        }
        setAttrs(formatAttrs(res, skus));
    }, [options, skus, value]);
    useEffect(() => {
        // 缓存旧值：> 格式化更新；> 防止SkuSelect与父级同时render的异常；
        prevAttrs.current = attrs;
    }, [attrs]);
    useEffect(() => {
        init();
    }, [init]);
    return (jsx("div", { style: { position: 'relative' }, children: attrs.map((option) => (jsx(AttrSelect, { label: option.name, value: option.selected, options: option.options, onChange: (val) => onAttrChange(option, val), renderOption: typeof renderAttrOption === 'function'
                ? (val) => renderAttrOption(val, option)
                : undefined }, option.id))) }));
};
/**
 * 检查sku列表中是否有包含该属性值的sku
 * @param {SkuBase[]} skus - sku集合
 * @param {SkuOption["id"]} key - sku属性key
 * @param {AttrOption["id"]} value - sku属性value
 */
function hasSku(skus, key, value) {
    return skus.some((sku) => sku.attrs.some((v) => v.attrId === key && v.valueId === value));
}
/**
 * 获取所选属性集
 */
function getAttrsSelected(attrs) {
    return attrs.filter((attr) => typeof attr.selected === 'number');
}
/**
 * 获取所匹配的sku
 */
function getSku(skus, attrs) {
    return skus.find((sku) => sku.attrs.every((i) => ~attrs.findIndex((j) => i.attrId === j.id && i.valueId === j.selected)));
}
/**
 * 格式化属性结构
 */
function formatAttrs(attrs, skus) {
    const attrsSelected = getAttrsSelected(attrs);
    return attrs.map((attr) => {
        const attrSelectedExceptSelf = attrsSelected.filter((i) => i.id !== attr.id);
        const skusValid = attrSelectedExceptSelf.length > 0
            ? skus.filter((sku) => attrSelectedExceptSelf.every((o) => ~sku.attrs.findIndex((skuAttr) => skuAttr.attrId === o.id && skuAttr.valueId === o.selected)))
            : skus;
        return {
            ...attr,
            options: attr.options.map((value) => ({
                ...value,
                disabled: !hasSku(skusValid, attr.id, value.id),
            })),
        };
    });
}

export { SkuSelect as default };
