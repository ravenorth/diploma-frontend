import { Table, Tag } from 'antd';
import styles from './UsersTable.module.css'
import { compareStringValues } from '../../../../../../core/utils/string';
import { ColumnSearch } from '../../../../../../common/tableComponents/ColumnSearch';
import { useAction, useAtom } from '@reatom/react';
import { userListAtom } from '../../../../../model/users/userList';
import { useMemo } from 'react';
import { confirmDeletePopupActions } from '../../../../../../common/confirmPopup/confirmDelete';
import { updateUserPopupActions } from '../../../../../viewModel/usersPopup/updateUser';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { UserFullData } from '../../../../../model/users/userData';
import { rowContextMenuActions } from '../../../../../../common/tableComponents/rowContextMenuState';
import { UserRole, userRoleArr, userRoleTranslation } from '../../../../../model/users/userRole';
import { usersLoadingAtom } from '../../../../../model/users/users';
import { useAtomWithSelector } from '../../../../../../core/reatom/useAtomWithSelector';
import { currUserAtom } from '../../../../../model/currUser/currUser';

const colorMap = {
    'admin': 'red',
    'senior manager': 'gold',
    'manager': 'green',
    'hotel': 'blue',
}

interface DataType {
    key: string;
    fullName: string;
    role: UserRole;
    email: string;
}

function remapUserFullDataToTableData(data: UserFullData[]): DataType[] {
    return data.map(item => ({
        key: item.id,
        ...item
    }))
}

function remapRowToUser(item: DataType): UserFullData {
    return {
        id: item.key,
        ...item
    }
}

function UsersTable() {
    const currUserId = useAtomWithSelector(currUserAtom, x => x?.id)
    const usersLoading = useAtom(usersLoadingAtom)
    const userList = useAtom(userListAtom)
    const dataSource = useMemo(() => userList && remapUserFullDataToTableData(Object.values(userList)), [userList])

    const handleOpenRowContextMenu = useAction(rowContextMenuActions.open)
    const handleOpenEditUserPopup = useAction(updateUserPopupActions.open)
    const handleOpenDeletePopup = useAction(confirmDeletePopupActions.open)

    const onContextMenu = (record: DataType, event: React.MouseEvent<any, MouseEvent>) => {
        const menuItems = [{
            key: '0',
            label: 'Редактировать пользователя',
            icon: <EditOutlined />,
            onClick: () => handleOpenEditUserPopup({
                mode: 'edit',
                data: remapRowToUser(record),
            }),
        }]
        if(currUserId !== record.key) {
            menuItems.push({
                key: '1',
                label: 'Удалить пользователя',
                icon: <DeleteOutlined />,
                onClick: () => handleOpenDeletePopup({
                    item: 'user',
                    id: record.key,
                }),
            })
        }

        event.preventDefault()
        handleOpenRowContextMenu({
            pos: {x: event.clientX, y: event.clientY},
            menuItems,
        })
    }
    
    const columns = [
        {
            title: 'ФИО',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '40%',
            sorter: (a: DataType, b: DataType) => compareStringValues(a.fullName, b.fullName),
            ...ColumnSearch<DataType, keyof DataType>('fullName'),
        },
        {
            title: 'Роль',
            dataIndex: 'role',
            key: 'role',
            width: '25%',
            filters: userRoleArr.map(role => ({
              text: userRoleTranslation[role],
              value: role,
            })),
            onFilter: (value: string | number | boolean, record: DataType) => record.role === value,
            sorter: (a: DataType, b: DataType) => compareStringValues(a.role, b.role),
            render: (_: string, record: DataType) => (
              <Tag color={colorMap[record.role]}>
                  {userRoleTranslation[record.role]}
              </Tag>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a: DataType, b: DataType) => compareStringValues(a.email, b.email),
            ...ColumnSearch<DataType, keyof DataType>('email'),
        },
        
    ]

    return (
        <Table
            className={styles.table}
            onRow={(record, _) => {
                return {
                    onContextMenu: (event) => onContextMenu(record, event),
                }
            }}
            bordered
            dataSource={dataSource}
            columns={columns}
            loading={usersLoading}
            pagination={{
                pageSize: 50,
                showSizeChanger: false,
                position: ['bottomRight'],
            }}
            size="middle"
        />
    )
}

export {
    UsersTable,
}