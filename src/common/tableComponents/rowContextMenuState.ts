import { combine, declareAction, declareAtom } from "@reatom/core";
import { MenuProps } from "antd";

type OpenPayload = {
    pos: {x: number, y: number},
    menuItems: MenuProps['items'],
}

const open = declareAction<OpenPayload>('rowContextMenu.open')
const change = declareAction<boolean>('rowContextMenu.change')

const isOpenedAtom = declareAtom<boolean>('rowContextMenu.isOpened', false, on => [
    on(open, () => true),
    on(change, (_, value) => value),
])

const posAtom = declareAtom('rowContextMenu.pos', {x: 0, y: 0}, on => [
    on(open, (_, value) => value.pos),
])

const menuItemsAtom = declareAtom('rowContextMenu.menuItems', [] as MenuProps['items'], on => [
    on(open, (_, value) => value.menuItems),
])

const rowContextMenuAtoms = combine({
    isOpenedAtom,
    posAtom,
    menuItemsAtom,
})

const rowContextMenuActions = {
    open,
    change,
}

export {
    rowContextMenuActions,
    rowContextMenuAtoms,
}