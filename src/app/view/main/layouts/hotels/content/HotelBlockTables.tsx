import { MenuProps } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAction, useAtom } from '@reatom/react';
import { rowContextMenuActions } from '../../../../../../common/tableComponents/rowContextMenuState';
import { updateCategoryPopupActions } from '../../../../../viewModel/hotelsPopup/updateCategory';
import { confirmDeletePopupActions } from '../../../../../../common/confirmPopup/confirmDelete';
import { HotelBlockTable } from './HotelBlockTable';
import { useAtomWithSelector } from '../../../../../../core/reatom/useAtomWithSelector';
import { currUserAtom } from '../../../../../model/currUser/currUser';
import { hotelAtoms } from '../../../../../model/hotels/hotels';

function HotelBlockTables() {
    const currUser = useAtom(currUserAtom)
    const currHotelData = useAtomWithSelector(hotelAtoms, x => x.currHotelAtom)
    
    const handleOpenRowContextMenu = useAction(rowContextMenuActions.open)
    const handleOpenCreateCategoryPopup = useAction(updateCategoryPopupActions.open)
    const handleOpenDeletePopup = useAction(confirmDeletePopupActions.open)

    const onContextMenu = (record: any, event: React.MouseEvent<any, MouseEvent>) => {
        event.preventDefault()
        handleOpenRowContextMenu({
            pos: {x: event.clientX, y: event.clientY},
            menuItems: [
                {
                    key: '0',
                    label: 'Редактировать категорию',
                    icon: <EditOutlined />,
                    onClick: (e) => {handleOpenCreateCategoryPopup({
                        mode: 'edit',
                        data: record,
                    })},
                },
                {
                    key: '1',
                    label: 'Удалить категорию',
                    icon: <DeleteOutlined />,
                    onClick: (e) => {handleOpenDeletePopup({
                        item: 'category',
                        id: record.categoryName,
                    })},
                },
            ] as MenuProps['items'],
        })
    }

    return (
        <>
            <HotelBlockTable
                type={0}
                data={currHotelData.hotelBlockData}
                onContextMenu={(currUser?.role === 'admin' || currUser?.role === 'hotel')
                    ? onContextMenu
                    : undefined
                }
            />
            <HotelBlockTable
                type={1}
                data={currHotelData.factBlockData}
            />
            <HotelBlockTable
                type={2}
                data={currHotelData.difBlockData}
            />
        </>
    )
}

export {
    HotelBlockTables,
}