import { Table } from 'antd';
import styles from './Tables.module.css'
import { useMemo } from 'react';
import { getDateArr, remapDMToString } from '../../../../../../core/time/time';
import { useAtomWithSelector } from '../../../../../../core/reatom/useAtomWithSelector';
import { eventsAtoms } from '../../../../../model/events/events';

function HotelTablesHeader() {
    const currEvent = useAtomWithSelector(eventsAtoms, x => x.currEventAtom)
    const eventDates = useMemo(() => getDateArr(currEvent.start, currEvent.end), [currEvent])

    let columns = [
        {
            title: 'Группа',
            dataIndex: 'groupName',
            key: 'groupName',
            width: 140,
        },
        {
            title: 'ФИО',
            dataIndex: 'guestFullName',
            key: 'guestFullName',
            width: 140,
        },
        {
            title: 'Номер',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: 120,
        },
        {
            title: 'Кол-во чел.',
            dataIndex: 'capacity',
            key: 'capacity',
            width: 65,
        },
        {
            title: 'Заезд',
            dataIndex: 'checkIn',
            key: 'checkIn',
            width: 72,
        },
        {
            title: 'Выезд',
            dataIndex: 'checkOut',
            key: 'checkOut',
            width: 72,
        },
    ]

    for (let i = 0; i < eventDates.length; i++) {
        const key = `slot${i}`
        columns.push({
            title: remapDMToString(eventDates[i]),
            dataIndex: key,
            key,
            width: 53,
        } as any)
    }

    columns.push({
        title: 'Кол-во суток',
        dataIndex: 'dayNumber',
        key: 'dayNumber',
        width: 65,
    })
    columns.push({
        title: 'Цена',
        dataIndex: 'price',
        key: 'price',
        width: 90,
    })
    columns.push({
        title: 'ИТОГО',
        dataIndex: 'total',
        key: 'total',
        width: 110,
    })

    return (
        <Table
            size="small"
            className={styles.header}
            bordered
            tableLayout={'fixed'}
            rowClassName={() => styles.tableCell}
            dataSource={[]}
            columns={columns as any}
            pagination={false}
        />
    )
}

export {
    HotelTablesHeader,
}