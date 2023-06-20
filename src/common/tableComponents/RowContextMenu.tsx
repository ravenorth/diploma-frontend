import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import { rowContextMenuActions, rowContextMenuAtoms } from "./rowContextMenuState";
import { useAtomWithSelector } from "../../core/reatom/useAtomWithSelector";
import { useAction } from "@reatom/react";

const rowContextMenuProperties = {
    title: '',
    key: 'menu',
    width: 42,
}

type RowContextMenuContentProps = {
    index: number,
    hoverRow: number | undefined,
    menuItems: any,
}

function RowContextMenuContent({
    index,
    hoverRow,
    menuItems,
}: RowContextMenuContentProps) {
    const menuProps = {
        items: menuItems,
    }

    if (hoverRow === index) {
        return (
            <Dropdown menu={menuProps} trigger={['click']}>
                <Button
                    type="text"
                    icon={<EllipsisOutlined style={{fontSize: 20}} />}
                    size='small'
                />
            </Dropdown>
        )
    }

    return (
        <div style={{height: 24}}></div>
    )
}

function RowContextMenu() {
    const isOpened = useAtomWithSelector(rowContextMenuAtoms, x => x.isOpenedAtom)
    const pos = useAtomWithSelector(rowContextMenuAtoms, x => x.posAtom)
    const menuItems = useAtomWithSelector(rowContextMenuAtoms, x => x.menuItemsAtom)
    const handleChange = useAction(rowContextMenuActions.change)

    const onClick: MenuProps['onClick'] = e => {
        handleChange(false);
    }
    
    const menuProps = {
        items: menuItems,
        onClick,
    }

    return (
        <Dropdown 
            open={isOpened}
            onOpenChange={handleChange}
            menu={menuProps}
            arrow={{ pointAtCenter: true }}
            trigger={['click']}
        >
            <div
                style={{
                    position: 'absolute',
                    left: pos.x,
                    top: pos.y,
                }}
            ></div>
        </Dropdown>
    )
}

export {
    rowContextMenuProperties,
    RowContextMenuContent,
    RowContextMenu,
}