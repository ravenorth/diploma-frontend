import { Table, Tag } from 'antd';
import styles from './Table.module.css'
import { useMemo } from 'react';
import { JournalStatistic, blockArr, blockColors, blockOptions } from '../../../../../model/events/eventData';
import { compareStringValues } from '../../../../../../core/utils/string';
import { ColumnSearch } from '../../../../../../common/tableComponents/ColumnSearch';
import { numberToStringMoney } from '../../../../../../core/money/money';
import { useAtomWithSelector } from '../../../../../../core/reatom/useAtomWithSelector';
import { getStringDateArr } from '../../../../../../core/time/time';
import { eventsAtoms } from '../../../../../model/events/events';

function remapStatDataToTableData(data: JournalStatistic[]): any[] {
    return data.map(record => {
        let item: any = {}
        for (let i = 0; i < record.slots.length; i++) {
            item[`slot${i}`] = record.slots[i]
        }
        return {
            ...record,
            ...item,
            key: record.hotelName + record.categoryName + record.block,
        }
    })
}

function StatisticsTable() {
    const currEvent = useAtomWithSelector(eventsAtoms, x => x.currEventAtom)
    const eventDates = useMemo(() => getStringDateArr(currEvent.start, currEvent.end), [currEvent])
    
    const data = useAtomWithSelector(eventsAtoms, x => x.journalStatisticAtom)
    const dataSource = useMemo(() => data && remapStatDataToTableData(Object.values(data)), [data])

    let columns = [
        {
            title: 'Гостиница',
            dataIndex: 'hotelName',
            key: 'hotelName',
            width: 150,
            sorter: (a: any, b: any) => compareStringValues(a.hotelName, b.hotelName),
            ...ColumnSearch<any, keyof any>('hotelName'),
        },
        {
            title: 'Номер',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: 170,
            sorter: (a: any, b: any) => compareStringValues(a.categoryName, b.categoryName),
            ...ColumnSearch<any, keyof any>('categoryName'),
        },
        {
            title: 'Блок',
            dataIndex: 'block',
            key: 'block',
            width: 110,
            sorter: (a: any, b: any) => compareStringValues(a.role, b.role),
            render: (_: string, record: any) => (
              <Tag color={blockColors[(record as JournalStatistic).block]}>
                  {blockOptions[(record as JournalStatistic).block]}
              </Tag>
            ),
            filters: blockArr.map(block => ({
              text: blockOptions[block],
              value: block,
            })),
            onFilter: (value: string | number | boolean, record: any) => record.block.includes(value as string),
        },
        {
            title: 'Мест',
            dataIndex: 'capacity',
            key: 'capacity',
            width: 65,
            sorter: (a: any, b: any) => a.capacity - b.capacity,
        },
    ]

    for (let i = 0; i <eventDates.length; i++) {
        const key = `slot${i}`
        columns.push({
            title: eventDates[i],
            dataIndex: key,
            key,
            width: 65,
            sorter: (a: any, b: any) => a[key] - b[key],
        })
    }

    columns.push({
            title: 'Цена',
            dataIndex: 'price',
            key: 'price',
            width: 90,
            render: (_: string, record: any) => <>{numberToStringMoney(record.price)}</>,
            sorter: (a: any, b: any) => a.price - b.price,
    })

    return (
        <Table
            size="small"
            className={styles.table}
            bordered
            tableLayout={'fixed'}
            rowClassName={() => styles.tableCell}
            dataSource={dataSource}
            columns={columns as any}
            pagination={{
                pageSize: 50,
                showSizeChanger: false,
                position: ['bottomLeft'],
            }}
        />
    )
}

export {
    StatisticsTable,
}