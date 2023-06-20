import { MenuProps } from "antd";

const POPUP_DEFAULT_WIDTH = 500

type SelectOption = {
    value: string,
    label: string,
}

type MenuOption = {
    key: string,
    label: string,
}

const buttonWhithMarginStyle: React.CSSProperties = {
    marginBottom: 15,
    marginRight: 20,
}

type MenuItem = Required<MenuProps>['items'][number]

function getMenuItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

export type {
    SelectOption,
    MenuOption,
    MenuItem,
}

export {
    POPUP_DEFAULT_WIDTH,
    getMenuItem,
    buttonWhithMarginStyle,
}