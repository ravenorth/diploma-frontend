import { Table } from 'antd';
import styles from './Table.module.css'
import { useMemo } from 'react';
import { JournalData } from '../../../../../model/events/eventData';
import { compareStringValues } from '../../../../../../core/utils/string';
import { ColumnSearch } from '../../../../../../common/tableComponents/ColumnSearch';
import { numberToStringMoney } from '../../../../../../core/money/money';
import { compareDateValues, getDateArr, remapDMToString } from '../../../../../../core/time/time';
import { useAtomWithSelector } from '../../../../../../core/reatom/useAtomWithSelector';
import { Dayjs } from 'dayjs';
import { eventsAtoms } from '../../../../../model/events/events';

function remapDataToTableData(data: JournalData[], eventDates: Dayjs[]): any[] {
    return data.map(record => {
        let item: any = {}
        for (let i = 0; i < eventDates.length; i++) {
            if ((eventDates[i] >= record.checkin) && (eventDates[i] <= record.checkout)) {
                item[`slot${i}`] = record.slots
            }
            else {
                item[`slot${i}`] = 0
            }
        }
        return {
            ...record,
            ...item,
            key: record.categoryName + record.groupName + record.fullName,
        }
    })
}

function DataTable() {
    const currEvent = useAtomWithSelector(eventsAtoms, x => x.currEventAtom)
    const eventDates = useMemo(() => getDateArr(currEvent.start, currEvent.end), [currEvent])
    
    const data = useAtomWithSelector(eventsAtoms, x => x.journalDataAtom)
    const dataSource = useMemo(() => data && remapDataToTableData(Object.values(data), eventDates), [data, eventDates])

    let columns = [
        {
            title: 'Гостиница',
            dataIndex: 'hotelName',
            key: 'hotelName',
            width: 120,
            sorter: (a: any, b: any) => compareStringValues(a.hotelName, b.hotelName),
            ...ColumnSearch<any, keyof any>('hotelName'),
        },
        {
            title: 'Группа',
            dataIndex: 'groupName',
            key: 'groupName',
            width: 120,
            sorter: (a: any, b: any) => compareStringValues(a.groupName, b.groupName),
            ...ColumnSearch<any, keyof any>('groupName'),
        },
        {
            title: 'Кол-во чел.',
            dataIndex: 'capacity',
            key: 'capacity',
            width: 65,
            sorter: (a: any, b: any) => a.capacity - b.capacity,
        },
        {
            title: 'Номер',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: 110,
            sorter: (a: any, b: any) => compareStringValues(a.categoryName, b.categoryName),
            ...ColumnSearch<any, keyof any>('categoryName'),
        },
        {
            title: 'Заезд',
            dataIndex: 'checkin',
            key: 'checkin',
            width: 70,
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
    ]

    for (let i = 0; i < eventDates.length; i++) {
        const key = `slot${i}`
        columns.push({
            title: remapDMToString(eventDates[i]),
            dataIndex: key,
            key,
            width: 65,
            sorter: (a: any, b: any) => a[key] - b[key],
        })
    }

    columns.push({
        title: 'Кол-во суток',
        dataIndex: 'dayNumber',
        key: 'dayNumber',
        width: 65,
        sorter: (a: any, b: any) => a.dayNumber - b.dayNumber,
    })
    columns.push({
        title: 'Цена',
        dataIndex: 'price',
        key: 'price',
        width: 90,
        render: (_: string, record: any) => <>{numberToStringMoney(record.price)}</>,
        sorter: (a: any, b: any) => a.price - b.price,
    })
    columns.push({
        title: 'ИТОГО',
        dataIndex: 'total',
        key: 'total',
        width: 110,
        render: (_: string, record: any) => <>{numberToStringMoney(record.total)}</>,
        sorter: (a: any, b: any) => a.total - b.total,
    })

    return (
        <Table
            size="small"
            className={styles.table}
            bordered
            tableLayout={'fixed'}
            rowClassName={() => styles.tableCell}
            dataSource={dataSource}
            columns={columns}
            pagination={{
                pageSize: 50,
                showSizeChanger: false,
                position: ['bottomLeft'],
            }}
        />
    )
}

export {
    DataTable,
}