import { useEffect } from 'react'
import { EventMenu } from './sidebar/EventMenu'
import { GuestsTable } from './content/GuestsTable'
import styles from './GuestsLayout.module.css'
import { useAction, useAtom } from '@reatom/react'
import { Button } from 'antd'
import { PlusOutlined } from "@ant-design/icons";
import { useAtomWithSelector } from '../../../../../core/reatom/useAtomWithSelector'
import { buttonWhithMarginStyle } from '../../../../viewModel/viewData'
import { groupsActions, groupsLoadingAtom } from '../../../../model/guests/groups'
import { eventsActions, eventsAtoms } from '../../../../model/events/events'
import { updateGroupPopupActions } from '../../../../viewModel/guestsPopup/updateGroup'

function GuestsLayout() {
    const handleGetEvents = useAction(eventsActions.getEvents)
    const handleGetGroups = useAction(groupsActions.getGroups)
    const groupsLoading = useAtom(groupsLoadingAtom)
    const currEventId = useAtomWithSelector(eventsAtoms, x => x.currEventIdAtom)

    const handleOpenCreateGroupPopup = useAction(updateGroupPopupActions.open)

	useEffect(() => {
        handleGetEvents()
    }, [handleGetEvents])

    useEffect(() => {
        if (currEventId) {
            handleGetGroups(currEventId)
        }
    }, [handleGetGroups, currEventId])

    return (
        <div className={styles.layout}>
            <EventMenu />
            <div className={styles.contentWrapper}>
                <div className={styles.buttonsWrapper}>
                    <Button 
                        icon={<PlusOutlined />}
                        loading={groupsLoading}
                        type="primary"
                        style={buttonWhithMarginStyle}
                        onClick={() => handleOpenCreateGroupPopup({mode: 'create'})}
                    >
                        Добавить группу
                    </Button>
                </div>
                <GuestsTable />
            </div>
        </div>
    )
}

export {
    GuestsLayout,
}