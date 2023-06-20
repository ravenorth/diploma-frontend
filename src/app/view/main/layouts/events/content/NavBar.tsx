import { Button, Dropdown, Menu, MenuProps } from "antd"
import styles from './NavBar.module.css'
import { SettingOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import { useAction, useAtom } from "@reatom/react";
import { confirmDeletePopupActions } from "../../../../../../common/confirmPopup/confirmDelete";
import { updateEventPopupActions } from "../../../../../viewModel/eventsPopup/updateEvent";
import { currUserAtom } from "../../../../../model/currUser/currUser";
import { eventsActions, eventsAtoms } from "../../../../../model/events/events";

const navStyle: React.CSSProperties = {
    fontFamily: 'var(--default-font-family)',
    fontWeight: 500,
    width: 300,
    background: 'none',
}

const buttonStyle: React.CSSProperties = {
    color: '#272A2F',
    marginTop: 7,
    marginRight: 5,
}

type NavBarProps = {
    currPage: string,
    setCurrPage: (currPage: string) => void
}

function NavBar({
    currPage,
    setCurrPage,
}: NavBarProps) {
    const currUser = useAtom(currUserAtom)
    const currEventId = useAtomWithSelector(eventsAtoms, x => x.currEventIdAtom)
    const currEventData = useAtomWithSelector(eventsAtoms, x => x.currEventAtom)
    const handleOpenEditEventPopup = useAction(updateEventPopupActions.open)
    const handleOpenDeletePopup = useAction(confirmDeletePopupActions.open)
    const handleExport = useAction(eventsActions.exportTable)

    const navItems: MenuProps['items'] = [
        {
            label: 'Статистика',
            key: 'statistics',
        },
        {
            label: 'Данные',
            key: 'data',
        },
    ]

    const buttonItems: MenuProps['items'] = currUser?.role === 'admin'
    ? [
        {
            key: '0',
            label: 'Редактировать мероприятие',
            icon: <EditOutlined />,
            onClick: () => handleOpenEditEventPopup({
                mode: 'edit',
                data: currEventData,
            }),
        },
        {
            key: '1',
            label: 'Экспортировать таблицу',
            icon: <DownloadOutlined />,
            onClick: () => handleExport(currPage),
        },
        {
            key: '2',
            label: 'Удалить мероприятие',
            icon: <DeleteOutlined />,
            onClick: () => handleOpenDeletePopup({
                item: 'event',
                id: currEventId,
            }),
        },
    ]
    : [
        {
            key: '1',
            label: 'Экспортировать таблицу',
            icon: <DownloadOutlined />,
            onClick: () => handleExport(currPage),
        },
    ]

    const buttonProps = {
        items: buttonItems,
    }
    
    return (
        <div className={styles.navBar}>
            <Menu
                onClick={(e) => {
                    setCurrPage(e.key)
                }}
                selectedKeys={[currPage]}
                mode="horizontal"
                items={navItems}
                style={navStyle}
            />
            {
                <Dropdown menu={buttonProps} trigger={['click']} >
                    <Button
                        style={buttonStyle}
                        type="text"
                        icon={<SettingOutlined />}
                    />
                </Dropdown>
            }
        </div>
    )
}

export {
    NavBar,
}