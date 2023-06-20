import { useEffect } from 'react'
import styles from './HotelsLayout.module.css'
import { useAction, useAtom } from '@reatom/react'
import { Button } from 'antd'
import { PlusOutlined } from "@ant-design/icons";
import { currUserAtom } from '../../../../model/currUser/currUser'
import { useAtomWithSelector } from '../../../../../core/reatom/useAtomWithSelector'
import { HotelMenu } from './sidebar/HotelMenu';
import { buttonWhithMarginStyle } from '../../../../viewModel/viewData';
import { HotelInfo } from './content/HotelInfo';
import { Preloader } from '../../../../../common/preloader/Preloader';
import { HotelBlockTables } from './content/HotelBlockTables';
import { HotelGuestsTable } from './content/HotelGuestsTable';
import { eventsActions, eventsAtoms } from '../../../../model/events/events';
import { hotelAtoms, hotelsActions } from '../../../../model/hotels/hotels';
import { updateCategoryPopupActions } from '../../../../viewModel/hotelsPopup/updateCategory';
import { HotelTablesHeader } from './content/HotelTablesHeader';
import { hotelListAtom } from '../../../../model/hotels/hotelList';

const preloaderStyle: React.CSSProperties = {
    marginLeft: 'calc(var(--layout-content-margin) / 2)',
}

function HotelsLayout() {
    const currUserRole = useAtomWithSelector(currUserAtom, x => x?.role)
    const guestData = useAtomWithSelector(hotelAtoms, x => x.currHotelAtom).guestsData
    const handleGetEvents = useAction(eventsActions.getEvents)
    const handleGetHotels = useAction(hotelsActions.getHotels)
    const handleGetEventData = useAction(eventsActions.getEventData)
    const currHotelLoading = useAtomWithSelector(hotelAtoms, x => x.currHotelLoadingAtom)
    const currEventId = useAtomWithSelector(eventsAtoms, x => x.currEventIdAtom)
    const hotelList = useAtom(hotelListAtom)

    const handleOpenCreateCategoryPopup = useAction(updateCategoryPopupActions.open)

    useEffect(() => {
        if (currUserRole === 'hotel') {
            document.documentElement.style.setProperty('--layout-content-margin', '0')
            document.documentElement.style.setProperty('--middle-width', '92vw')
        }
        else {
            document.documentElement.style.setProperty('--layout-content-margin', '200px')
            document.documentElement.style.setProperty('--middle-width', '80vw')
        }
    }, [currUserRole])

	useEffect(() => {
        handleGetEvents()
    }, [handleGetEvents])

    useEffect(() => {
        if (currEventId) {
            handleGetEventData(currEventId)
            handleGetHotels(currEventId)
        }
    }, [handleGetHotels, handleGetEventData, currEventId])

    return (
        <div className={styles.layout}>
            {currUserRole !== 'hotel' && <HotelMenu />}
            {currHotelLoading ?
                <Preloader size={'large'} style={preloaderStyle} /> :
                Object.values(hotelList).length > 0 ?
                    <div className={styles.contentWrapper}>
                        <HotelInfo />
                        {(currUserRole === 'admin' || currUserRole === 'hotel') &&
                            <div className={styles.buttonsWrapper}>
                                <Button 
                                    icon={<PlusOutlined />}
                                    loading={currHotelLoading}
                                    type="primary"
                                    style={buttonWhithMarginStyle}
                                    onClick={() => handleOpenCreateCategoryPopup({mode: 'create'})}
                                >
                                    Добавить категорию
                                </Button>
                            </div>
                        }
                        <div className={styles.tablesWrapper}>
                            <HotelTablesHeader />
                            {guestData?.length > 0 && <HotelGuestsTable />}
                            <HotelBlockTables />
                        </div>
                    </div>
                : <></>
            }
        </div>
    )
}

export {
    HotelsLayout,
}