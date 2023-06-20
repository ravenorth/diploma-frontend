import { Button, Menu, MenuProps } from "antd";
import styles from './EventMenu.module.css'
import { useAction, useAtom } from "@reatom/react";
import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import { SkeltonList } from "../../../../../../common/preloader/SkeletonList";
import { useMemo } from "react";
import { remapToMenuOption } from "../../../../../../core/utils/option";
import { PlusOutlined } from "@ant-design/icons";
import { eventListAtom } from "../../../../../model/events/eventList";
import { currUserAtom } from "../../../../../model/currUser/currUser";
import { eventsActions, eventsAtoms } from "../../../../../model/events/events";
import { updateEventPopupActions } from "../../../../../viewModel/eventsPopup/updateEvent";

const buttonStyle: React.CSSProperties = {
    paddingLeft: 4,
    width: 185,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
}

function EventMenu() {
    const currUser = useAtom(currUserAtom)
    const currEventId = useAtomWithSelector(eventsAtoms, x => x.currEventIdAtom)
    const eventLoading = useAtomWithSelector(eventsAtoms, x => x.eventsLoadingAtom)
    const handleSetCurrEventId = useAction(eventsActions.setCurrEventId)
    const handleOpenCreateEventPopup = useAction(updateEventPopupActions.open)

    const eventList = useAtom(eventListAtom)
    const eventOptions = useMemo(() => Object.values(eventList).map(item => remapToMenuOption(item.id, item.name)), [eventList])

    const onClick: MenuProps['onClick'] = e => {
        handleSetCurrEventId(e.key);
    }

    return (
        <div className={styles.sider}>
            {currUser?.role === 'admin' &&
                <Button 
                    style={buttonStyle}
                    icon={<PlusOutlined />}
                    loading={eventLoading}
                    type="primary"
                    onClick={() => handleOpenCreateEventPopup({mode: 'create'})}
                >
                    Добавить мероприятие
                </Button>
            }
            {eventLoading ?
                <SkeltonList /> :
                <Menu className={styles.menu}
                    onClick={onClick}
                    mode="inline"
                    items={eventOptions}
                    selectedKeys={[currEventId]}
                />
            }
        </div>
    )
}

export {
    EventMenu,
}