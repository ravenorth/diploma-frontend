import { Menu, MenuProps } from "antd";
import styles from './EventMenu.module.css'
import { useAction, useAtom } from "@reatom/react";
import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import { SkeltonList } from "../../../../../../common/preloader/SkeletonList";
import { useMemo } from "react";
import { remapToMenuOption } from "../../../../../../core/utils/option";
import { eventListAtom } from "../../../../../model/events/eventList";
import { eventsActions, eventsAtoms } from "../../../../../model/events/events";

function EventMenu() {
    const currEventId = useAtomWithSelector(eventsAtoms, x => x.currEventIdAtom)
    const eventLoading = useAtomWithSelector(eventsAtoms, x => x.eventsLoadingAtom)
    const handleSetCurrEventId = useAction(eventsActions.setCurrEventId)

    const eventList = useAtom(eventListAtom)
    const eventOptions = useMemo(() => Object.values(eventList).map(item => remapToMenuOption(item.id, item.name)), [eventList])

    const onClick: MenuProps['onClick'] = e => {
        handleSetCurrEventId(e.key);
    }

    return (
        <div className={styles.sider}>
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