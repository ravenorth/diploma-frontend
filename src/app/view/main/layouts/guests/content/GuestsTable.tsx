import { useAction, useAtom } from "@reatom/react";
import { useMemo } from "react";
import { Badge, MenuProps, Table } from "antd";
import { compareStringValues } from "../../../../../../core/utils/string";
import { ColumnSearch } from "../../../../../../common/tableComponents/ColumnSearch";
import styles from './GuestsTable.module.css'
import { EditOutlined, DeleteOutlined, UsergroupDeleteOutlined, PlusOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { confirmDeletePopupActions } from "../../../../../../common/confirmPopup/confirmDelete";
import { GroupFullData } from "../../../../../model/guests/groupData";
import { Dayjs } from "dayjs";
import { UserData } from "../../../../../model/users/userData";
import { compareDateValues, remapDMToString } from "../../../../../../core/time/time";
import { rowContextMenuActions } from "../../../../../../common/tableComponents/rowContextMenuState";
import { settleGroupPopupActions } from "../../../../../viewModel/guestsPopup/settleGroup";
import { CategoryType, categoryTypeArr, categoryTypeMap } from "../../../../../model/hotels/categoryData";
import { groupListAtom } from "../../../../../model/guests/groupList";
import { Stub } from "../../../../../../common/stub/Stub";
import { GuestFullData } from "../../../../../model/guests/guestData";
import { groupsLoadingAtom } from "../../../../../model/guests/groups";
import { updateGuestPopupActions } from "../../../../../viewModel/guestsPopup/updateGuest";
import { updateGroupPopupActions } from "../../../../../viewModel/guestsPopup/updateGroup";

interface DataType {
    key: string;
    name: string;
    preferredCategory: CategoryType,
    checkin: Dayjs,
    checkout: Dayjs,
    status: boolean,
    manager?: UserData,
    guests: GuestFullData[],
}

interface ExpandedDataType {
    key: string;
    fullName: string,
    contact: string,
}

function remapGroupDataToTableData(data: GroupFullData[]): DataType[] {
    return data.map(item => ({
        key: item.id,
        ...item
    }))
}

function remapGuestDataToTableData(data: GuestFullData[]): ExpandedDataType[] {
    return data.map(item => ({
        key: item.id,
        ...item
    }))
}

function remapRowToGroup(item: DataType): GroupFullData {
    return {
        id: item.key,
        ...item
    }
}

function remapRowToGuest(item: ExpandedDataType): GuestFullData {
    return {
        id: item.key,
        ...item
    }
}

function GuestsTable() {
    const groupsLoading = useAtom(groupsLoadingAtom)
    const groupList = useAtom(groupListAtom)
    const dataSource = useMemo(() => groupList && remapGroupDataToTableData(Object.values(groupList)), [groupList])

    const handleOpenRowContextMenu = useAction(rowContextMenuActions.open)
    const handleOpenEditGroupPopup = useAction(updateGroupPopupActions.open)
    const handleOpenUpdateGuestPopup = useAction(updateGuestPopupActions.open)
    const handleOpenSettleGroupPopup = useAction(settleGroupPopupActions.open)
    const handleOpenDeletePopup = useAction(confirmDeletePopupActions.open)

    const onGroupContextMenu = (record: DataType, event: React.MouseEvent<any, MouseEvent>) => {
        event.preventDefault()
        handleOpenRowContextMenu({
            pos: {x: event.clientX, y: event.clientY},
            menuItems: [
                {
                    key: '0',
                    label: 'Редактировать группу',
                    icon: <EditOutlined />,
                    onClick: () => handleOpenEditGroupPopup({
                        mode: 'edit',
                        data: remapRowToGroup(record),
                    }),
                },
                {
                    key: '1',
                    label: 'Добавить гостя',
                    icon: <PlusOutlined />,
                    onClick: () => handleOpenUpdateGuestPopup({
                        mode: 'create',
                        parentGroup: remapRowToGroup(record),
                    }),
                },
                {
                    key: '2',
                    label: record.status ? 'Удалить размещение группы' : 'Разместить группу',
                    icon: record.status ? <UsergroupDeleteOutlined /> : <UsergroupAddOutlined />,
                    onClick: () => record.status 
                        ? handleOpenDeletePopup({
                            item: 'settlement',
                            id: record.key,
                        })
                        : handleOpenSettleGroupPopup(remapRowToGroup(record)),
                },
                {
                    key: '3',
                    label: 'Удалить группу',
                    icon: <DeleteOutlined />,
                    onClick: () => handleOpenDeletePopup({
                        item: 'group',
                        id: record.key,
                    }),
                },
            ] as MenuProps['items'],
        })
    }

    const onGuestContextMenu = (record: DataType, expandedRecord: ExpandedDataType, event: React.MouseEvent<any, MouseEvent>) => {
        event.preventDefault()
        handleOpenRowContextMenu({
            pos: {x: event.clientX, y: event.clientY},
            menuItems: [
                {
                    key: '0',
                    label: 'Редактировать гостя',
                    icon: <EditOutlined />,
                    onClick: () => handleOpenUpdateGuestPopup({
                        mode: 'edit',
                        parentGroup: remapRowToGroup(record),
                        data: remapRowToGuest(expandedRecord),
                    }),
                },
                {
                    key: '3',
                    label: 'Удалить гостя',
                    icon: <DeleteOutlined />,
                    onClick: () => handleOpenDeletePopup({
                        item: 'guest',
                        parentGroup: remapRowToGroup(record),
                        id: expandedRecord.key,
                    }),
                },
            ] as MenuProps['items'],
        })
    }

    const expandedRowRender = (record: DataType) => {
        const columns = [
            {
                title: 'ФИО',
                dataIndex: 'fullName',
                key: 'fullName',
            },
            {
                title: 'Контакт',
                dataIndex: 'contact',
                key: 'contact',
                render: (text: string) => text
                    ? <>{text}</>
                    : <Stub text={'Не указан'}/>
            },
        ]

        return <Table
            columns={columns}
            dataSource={remapGuestDataToTableData(record.guests) as any}
            pagination={false}
            onRow={(expandedRecord, _) => {
                return {
                    onContextMenu: (event) => onGuestContextMenu(record, expandedRecord, event),
                }
            }}
            bordered
        />
    }
    
    const columns = [
        {
            title: 'Группа',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: DataType, b: DataType) => compareStringValues(a.name, b.name),
            ...ColumnSearch<DataType, keyof DataType>('name'),
        },
        {
            title: 'Заезд',
            dataIndex: 'checkin',
            key: 'checkin',
            width: 72,
            render: (_: string, record: any) => <>{remapDMToString(record.checkin)}</>,
            sorter: (a: any, b: any) => compareDateValues(a.checkin, b.checkin),
        },
        {
            title: 'Выезд',
            dataIndex: 'checkout',
            key: 'checkout',
            width: 72,
            render: (_: string, record: any) => <>{remapDMToString(record.checkout)}</>,
            sorter: (a: any, b: any) => compareDateValues(a.checkout, b.checkout),
        },
        {
            title: 'Предпочитаемая категория',
            dataIndex: 'preferredCategory',
            key: 'preferredCategory',
            width: '15%',
            filters: categoryTypeArr.map(item => ({
                text: categoryTypeMap[item],
                value: item,
            })),
            onFilter: (value: string | number | boolean, record: DataType) => record.preferredCategory === value,
            sorter: (a: DataType, b: DataType) => compareStringValues(categoryTypeMap[a.preferredCategory], categoryTypeMap[b.preferredCategory]),
            render: (_: string, record: DataType) => <>{categoryTypeMap[record.preferredCategory]}</>,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            filters: [
                {
                    text: 'Размещена',
                    value: true,
                },
                {
                    text: 'Не размещена',
                    value: false,
                },
            ],
            onFilter: (value: string | number | boolean, record: DataType) => record.status === value,
            filterMultiple: false,
            render: (_: string, record: DataType) => record.status
                ? <Badge status="success" text="Размещена" />
                : <Badge status="error" text="Не размещена" />,
        },
        {
            title: 'Менеджер',
            dataIndex: 'manager',
            key: 'manager',
            width: '25%',
            sorter: (a: DataType, b: DataType) => compareStringValues(a.manager?.fullName || '', b.manager?.fullName || ''),
            render: (_: string, record: DataType) => record.manager
                ? <>{record.manager.fullName}</>
                : <Stub text={'Не назначен'}/>,
        },
    ]

    return (
        <Table
            className={styles.table}
            onRow={(record, _) => {
                return {
                    onContextMenu: (event) => onGroupContextMenu(record, event),
                }
            }}
            expandable={{ expandedRowRender }}
            bordered
            tableLayout={'fixed'}
            dataSource={dataSource}
            columns={columns}
            loading={groupsLoading}
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
    GuestsTable,
}