import { Table } from 'antd';
import styles from './Tables.module.css'
import { useMemo } from 'react';
import { compareStringValues } from '../../../../../../core/utils/string';
import { ColumnSearch } from '../../../../../../common/tableComponents/ColumnSearch';
import { numberToStringMoney } from '../../../../../../core/money/money';
import { compareDateValues, getDateArr, remapDMToString } from '../../../../../../core/time/time';
import { useAtomWithSelector } from '../../../../../../core/reatom/useAtomWithSelector';
import { Dayjs } from 'dayjs';
import { HotelGuestsRowData } from '../../../../../model/hotels/hotelData';
import { hotelAtoms } from '../../../../../model/hotels/hotels';
import { eventsAtoms } from '../../../../../model/events/events';

function remapStatDataToTableData(data: HotelGuestsRowData[], eventDates: Dayjs[]): any[] {
    return data.map(record => {
        let item: any = {}
        for (let i = 0; i < eventDates.length; i++) {
            if ((eventDates[i] >= record.checkIn) && (eventDates[i] <= record.checkOut)) {
                item[`slot${i}`] = 1
            }
            else {
                item[`slot${i}`] = 0
            }
        }
        return {
            ...record,
            ...item,
            key: record.id,
        }
    })
}

function getTotal(data: HotelGuestsRowData[]): number {
    let total = 0
    for (let i = 0; i < data.length; i++) {
        total += data[i].total
    }
    return total
}

function HotelGuestsTable() {
    const data = useAtomWithSelector(hotelAtoms, x => x.currHotelAtom).guestsData
    const total = useMemo(() => data && getTotal(data), [data])
    
    const currEvent = useAtomWithSelector(eventsAtoms, x => x.currEventAtom)
    const eventDates = useMemo(() => getDateArr(currEvent.start, currEvent.end), [currEvent])
    const dataSource = useMemo(() => data && remapStatDataToTableData(data, eventDates), [data, eventDates])

    let columns = [
        {
            title: 'Группа',
            dataIndex: 'groupName',
            key: 'groupName',
            width: 140,
            sorter: (a: any, b: any) => compareStringValues(a.groupName, b.groupName),
            ...ColumnSearch<any, keyof any>('groupName'),
        },
        {
            title: 'ФИО',
            dataIndex: 'guestFullName',
            key: 'guestFullName',
            width: 140,
            sorter: (a: any, b: any) => compareStringValues(a.guestFullName, b.guestFullName),
            ...ColumnSearch<any, keyof any>('guestFullName'),
        },
        {
            title: 'Номер',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: 120,
            sorter: (a: any, b: any) => compareStringValues(a.categoryName, b.categoryName),
            ...ColumnSearch<any, keyof any>('categoryName'),
        },
        {
            title: 'Кол-во чел.',
            dataIndex: 'capacity',
            key: 'capacity',
            width: 65,
            sorter: (a: any, b: any) => a.capacity - b.capacity,
        },
        {
            title: 'Заезд',
            dataIndex: 'checkIn',
            key: 'checkIn',
            width: 72,
            render: (_: string, record: any) => <>{remapDMToString(record.checkIn)}</>,
            sorter: (a: any, b: any) => compareDateValues(a.checkIn, b.checkIn),
        },
        {
            title: 'Выезд',
            dataIndex: 'checkOut',
            key: 'checkOut',
            width: 72,
            render: (_: string, record: any) => <>{remapDMToString(record.checkOut)}</>,
            sorter: (a: any, b: any) => compareDateValues(a.checkOut, b.checkOut),
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
            summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                        index={0}
                        colSpan={columns.length}
                        align={'right'}
                    >
                        {numberToStringMoney(total)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
            )}
            bordered
            tableLayout={'fixed'}
            showHeader={false}
            rowClassName={() => styles.tableCell}
            dataSource={dataSource}
            columns={columns as any}
            pagination={false}
        />
    )
}

export {
    HotelGuestsTable,
}