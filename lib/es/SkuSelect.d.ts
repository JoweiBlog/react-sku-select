/// <reference types="react" />
import { AttrOption } from './AttrSelect';
export interface SkuOption {
    id: number | string;
    name: string;
    options: AttrOption[];
    selected?: AttrOption['id'];
}
export interface SkuAttrOption {
    attrId: SkuOption['id'];
    valueId: AttrOption['id'];
}
export interface SkuBase {
    attrs: SkuAttrOption[];
}
export interface SkuSelectProps<T extends SkuBase> {
    /** 属性选项集 */
    options: SkuOption[];
    /** sku列表 */
    skus: T[];
    value?: T;
    /** 变更回调(value - 所匹配的sku, attrsSelected - 所选属性集合) */
    onChange?: (value?: T, attrsSelected?: SkuOption[]) => void;
    /** 属性选项内容渲染 */
    renderAttrOption?: (option: AttrOption, options: SkuOption) => React.ReactNode;
}
/** SKU选择 */
declare const SkuSelect: <T extends SkuBase>({ options, skus, value, onChange, renderAttrOption, }: SkuSelectProps<T>) => JSX.Element;
export default SkuSelect;
/**
 * 检查sku列表中是否有包含该属性值的sku
 * @param {SkuBase[]} skus - sku集合
 * @param {SkuOption["id"]} key - sku属性key
 * @param {AttrOption["id"]} value - sku属性value
 */
export declare function hasSku<T extends SkuBase>(skus: T[], key: SkuOption['id'], value: AttrOption['id']): boolean;
