import { Header } from "antd/lib/layout/layout"
import { DownOutlined, LockOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import styles from './MainHeader.module.css'
import { useAction, useAtom } from "@reatom/react";
import { Button, Dropdown, MenuProps, Space } from "antd";
import { currUserAtom } from "../../../model/currUser/currUser";
import { authActions } from "../../../model/auth/auth";
import { updatePasswordPopupActions } from "../../../viewModel/usersPopup/updatePasswordPopup";
import { updateUserPopupActions } from "../../../viewModel/usersPopup/updateUser";

const items: MenuProps['items'] = [
    {
        key: '0',
        label: 'Редактировать профиль',
        icon: <UserOutlined />,
    },
    {
        key: '1',
        label: 'Изменить пароль',
        icon: <LockOutlined />,
    },
    {
        key: '2',
        label: 'Выйти',
        icon: <LogoutOutlined />,
    },
];

function MainHeader() {
    const currUser = useAtom(currUserAtom)
    const handleOpenEditUserPopup = useAction(updateUserPopupActions.open)
    const handleOpenUpdatePasswordPopup = useAction(updatePasswordPopupActions.open)
    const handleLogout = useAction(authActions.logout)

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case '0':
                currUser && handleOpenEditUserPopup({
                    mode: 'edit',
                    data: currUser,
                })
                break
            case '1':
                handleOpenUpdatePasswordPopup()
                break
            case '2':
                handleLogout()
                break
            default:
                break
        }
    };
    
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (
        <Header className={styles.header}>
            <Dropdown menu={menuProps} trigger={['click']}>
              <Button type={'text'} className={styles.currUser}>
                <Space className={styles.currUser}>
                    {currUser?.fullName}
                    <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
        </Header>
    )
}

export {
    MainHeader,
}