import {BarChartOutlined, EnvironmentOutlined, TeamOutlined, DesktopOutlined} from "@ant-design/icons";
import {Menu, MenuProps} from "antd";
import {useLocation} from "react-router-dom";
import styles from './Sidebar.module.css'
import { useAtom } from "@reatom/react";
import { MenuItem, getMenuItem } from "../../../viewModel/viewData";
import { currUserAtom } from "../../../model/currUser/currUser";
import { Router } from "../../../../core/router/router";

const adminItems: MenuItem[] = [
    getMenuItem('Статистика', 'events', <BarChartOutlined />),
    getMenuItem('Гостиницы', 'hotels', <EnvironmentOutlined />),
    getMenuItem('Гости', 'guests', <TeamOutlined />),
    getMenuItem('Пользователи', 'users', <DesktopOutlined />),
];

const managerItems: MenuItem[] = [
    getMenuItem('Статистика', 'events', <BarChartOutlined />),
    getMenuItem('Гостиницы', 'hotels', <EnvironmentOutlined />),
    getMenuItem('Гости', 'guests', <TeamOutlined/>),
];

function getDefaultSelectedSection(path: string): string {
    switch (path) {
        case Router.Events.url():
            return 'events'
        case Router.Hotels.url():
            return 'hotels'
        case Router.Guests.url():
            return 'guests'
        case Router.Users.url():
            return 'users'
    }
    return ''
}

function Sidebar() {
    const currUser = useAtom(currUserAtom)
    const location = useLocation()

    const onClick: MenuProps['onClick'] = e => {
        switch (e.key) {
            case 'events':
                Router.Events.open()
                break
            case 'hotels':
                Router.Hotels.open()
                break
            case 'guests':
                Router.Guests.open()
                break
            case 'users':
                Router.Users.open()
                break
        }
    };

    return (
        <div className={styles.sider}>
            <Menu
                className={styles.menu}
                onClick={onClick}
                mode="inline"
                items={currUser?.role === 'admin' ? adminItems : managerItems}
                selectedKeys={[getDefaultSelectedSection(location.pathname)]}
                inlineCollapsed={true}
            />
        </div>
    )
}

export {
    Sidebar,
}