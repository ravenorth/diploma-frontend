import { Button } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import styles from './UsersLayout.module.css'
import { useAction, useAtom } from '@reatom/react';
import { useEffect } from 'react';
import { UsersTable } from './content/UsersTable';
import { usersActions, usersLoadingAtom } from '../../../../model/users/users';
import { updateUserPopupActions } from '../../../../viewModel/usersPopup/updateUser';

function UsersLayout() {
    const handleGetUsers = useAction(usersActions.getUsers)
    const usersLoading = useAtom(usersLoadingAtom)
    const handleOpenCreateUserPopup = useAction(updateUserPopupActions.open)

	useEffect(() => {
        handleGetUsers()
    }, [handleGetUsers])

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <Button 
                    icon={<PlusOutlined />}
                    loading={usersLoading}
                    type="primary"
                    style={{ marginBottom: 15 }}
			    	onClick={() => handleOpenCreateUserPopup({mode: 'create'})}
                >
                    Добавить пользователя
                </Button>
                <UsersTable />
            </div>
        </div>
    )
}

export {
    UsersLayout,
}