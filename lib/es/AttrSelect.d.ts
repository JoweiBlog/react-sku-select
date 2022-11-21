import { ReactNode } from 'react';
/** sku 属性选项结构 */
export interface AttrOption {
    id: number | string;
    name: string;
    disabled?: boolean;
}
export interface AttrSelectProp {
    label: string;
    value?: AttrOption['id'];
    onChange?: (value?: AttrOption['id']) => void;
    options: AttrOption[];
    renderOption?: (option: AttrOption) => ReactNode;
}
/** 属性选择 */
declare const AttrSelect: ({ label, onChange, options, value, renderOption, }: AttrSelectProp) => JSX.Element;
export default AttrSelect;
