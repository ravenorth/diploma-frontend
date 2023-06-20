import { Table, Tag } from 'antd';
import styles from './Tables.module.css'
import { numberToStringMoney } from '../../../../../../core/money/money';
import { useAtomWithSelector } from '../../../../../../core/reatom/useAtomWithSelector';
import { getStringDateArr } from '../../../../../../core/time/time';
import { useMemo } from 'react';
import { ColumnType } from 'antd/es/table';
import { Block, blockColors, blockTitles } from '../../../../../model/events/eventData';
import { HotelBlockRowData } from '../../../../../model/hotels/hotelData';
import { eventsAtoms } from '../../../../../model/events/events';

function remapDataToTableData(data: HotelBlockRowData[], eventDates: string[]): any[] {
    return data.map(record => {
        let item: any = {}
        for (let i = 0; i < eventDates.length; i++) {
            item[`slot${i}`] = record.slots ? record.slots[i] : 0
        }
        return {
            ...record,
            ...item,
            key: record.categoryName,
        }
    })
}

type HotelBlockTableProps = {
    type: Block,
    data: HotelBlockRowData[],
    onContextMenu?: (record: any, event: React.MouseEvent<any, MouseEvent>) => void,
}

function HotelBlockTable({
    type,
    data,
    onContextMenu,
}: HotelBlockTableProps) {
    const currEvent = useAtomWithSelector(eventsAtoms, x => x.currEventAtom)
    const eventDates = useMemo(() => getStringDateArr(currEvent.start, currEvent.end), [currEvent])
    const dataSource = useMemo(() => data && remapDataToTableData(Object.values(data), eventDates), [data, eventDates])

    let columns: ColumnType<any>[] = [
        {
            title: 'Группа',
            dataIndex: 'group',
            key: 'group',
            width: 140,
            render: () => <></>,
        },
        {
            title: 'ФИО',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 140,
            render: () => <></>,
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
            dataIndex: 'checkin',
            key: 'checkin',
            width: 72,
            render: () => <></>,
        },
        {
            title: 'Выезд',
            dataIndex: 'checkout',
            key: 'checkout',
            width: 72,
            render: () => <></>,
        },
    ]

    for (let i = 0; i < eventDates.length; i++) {
        const key = `slot${i}`
        columns.push({
            title: eventDates[i],
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
        render: () => <></>,
    })
    columns.push({
        title: 'Цена',
        dataIndex: 'price',
        key: 'price',
        width: 90,
        render: (_: string, record: any) => <>{numberToStringMoney(record.price)}</>,
    })
    columns.push({
        title: 'ИТОГО',
        dataIndex: 'total',
        key: 'total',
        width: 110,
        render: () => <></>,
    })

    return (
        <>
            <Table
                size="small"
                className={styles.table}
                onRow={(record, _) => {
                    return {
                        onContextMenu: (event) => onContextMenu && onContextMenu(record, event),
                    }
                }}
                title={() =>
                    <Tag color={blockColors[type]}>
                        {blockTitles[type]}
                    </Tag>
                }
                showHeader={false}
                bordered
                tableLayout={'fixed'}
                rowClassName={() => styles.tableCell}
                dataSource={dataSource}
                columns={columns as any}
                pagination={false}
            />
        </>
    )
}

export {
    HotelBlockTable,
}