import { Button, Menu, MenuProps, Select } from "antd";
import styles from './HotelMenu.module.css'
import { PlusOutlined } from "@ant-design/icons";
import { useAction, useAtom } from "@reatom/react";
import { SkeltonList } from "../../../../../../common/preloader/SkeletonList";
import { useMemo } from "react";
import { remapToMenuOption, remapToSelectOption } from "../../../../../../core/utils/option";
import { eventListAtom } from "../../../../../model/events/eventList";
import { currUserAtom } from "../../../../../model/currUser/currUser";
import { eventsActions, eventsAtoms } from "../../../../../model/events/events";
import { updateHotelInfoPopupActions } from "../../../../../viewModel/hotelsPopup/updateHotelInfo";
import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import { hotelAtoms, hotelsActions } from "../../../../../model/hotels/hotels";
import { hotelListAtom } from "../../../../../model/hotels/hotelList";

const buttonStyle: React.CSSProperties = {
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
}

const selectStyle: React.CSSProperties = {
    fontFamily: 'var(--default-font-family)',
    margin: 5,
    width: 185,
}

function HotelMenu() {
    const currUser = useAtom(currUserAtom)
    const currEventId = useAtomWithSelector(eventsAtoms, x => x.currEventIdAtom)
    const currHotel = useAtomWithSelector(hotelAtoms, x => x.currHotelAtom)
    const hotelsLoading = useAtomWithSelector(hotelAtoms, x => x.hotelsLoadingAtom)
    const handleSetCurrEventId = useAction(eventsActions.setCurrEventId)
    const handleSetCurrHotelId = useAction(hotelsActions.setCurrHotelId)
    const handleOpenCreateHotelInfoPopup = useAction(updateHotelInfoPopupActions.open)

    const eventList = useAtom(eventListAtom)
    const eventOptions = useMemo(() => Object.values(eventList).map(item => remapToSelectOption(item.id, item.name)), [eventList])
    
    const hotelList = useAtom(hotelListAtom)
    const hotelOptions = useMemo(() => Object.values(hotelList).map(item => remapToMenuOption(item.id, item.name)), [hotelList])

    const onClick: MenuProps['onClick'] = e => {
        handleSetCurrHotelId(e.key);
    }

    return (
        <div className={styles.sider}>
            <Select
                style={selectStyle}
                value={currEventId}
                onChange={handleSetCurrEventId}
                options={eventOptions}
                showSearch
                placeholder="Поиск..."
            />
            {currUser?.role === 'admin' && <> 
                <Button 
                    style={buttonStyle}
                    icon={<PlusOutlined />}
                    loading={hotelsLoading}
                    type="primary"
                    onClick={() => handleOpenCreateHotelInfoPopup({mode: 'create'})}
                >
                    Добавить гостиницу
                </Button>
            </>}
            {
            hotelsLoading ?
                <SkeltonList />
            :
                hotelOptions?.length > 0 && <Menu className={styles.menu}
                    onClick={onClick}
                    mode="inline"
                    items={hotelOptions}
                    selectedKeys={[currHotel.id]}
                />
            }
        </div>
    )
}

export {
    HotelMenu,
}