import { useAction } from "@reatom/react"
import { useAtomWithSelector } from "../../../../../core/reatom/useAtomWithSelector"
import { useEffect, useState } from "react"
import styles from './EventsLayout.module.css'
import { EventMenu } from "./sidebar/EventMenu"
import { NavBar } from "./content/NavBar"
import { StatisticsTable } from "./content/StatisticsTable"
import { DataTable } from "./content/DataTable"
import { Preloader } from "../../../../../common/preloader/Preloader"
import { eventsActions, eventsAtoms } from "../../../../model/events/events"

const preloaderStyle: React.CSSProperties = {
    marginLeft: 100,
}

function EventsLayout() {
    const [currPage, setCurrPage] = useState('statistics')
    const handleGetEvents = useAction(eventsActions.getEvents)
    const handleGetEventData = useAction(eventsActions.getEventData)
    const handleGetJournalStatistics = useAction(eventsActions.getJournalStatistic)
    const handleGetJournalData= useAction(eventsActions.getJournalData)
    const currEventId = useAtomWithSelector(eventsAtoms, x => x.currEventIdAtom)
    const eventDataLoading = useAtomWithSelector(eventsAtoms, x => x.eventDataLoadingAtom)
    const eventListLoading = useAtomWithSelector(eventsAtoms, x => x.eventsLoadingAtom)

	useEffect(() => {
        handleGetEvents()
    }, [handleGetEvents])

    useEffect(() => {
        if (currEventId) {
            handleGetEventData(currEventId)
        }
    }, [handleGetEventData, currEventId])

    useEffect(() => {
        if (currEventId) {
            if (currPage === 'statistics') {
                handleGetJournalStatistics(currEventId)
            }
            else {
                handleGetJournalData(currEventId)
            }
        }
    }, [currEventId, currPage, handleGetJournalStatistics, handleGetJournalData])

    return (
        <div className={styles.layout}>
            <EventMenu />
            <div className={styles.contentWrapper}>
                {(eventDataLoading || eventListLoading) ?
                <Preloader size="large" style={preloaderStyle} /> :
                <>
                    <NavBar currPage={currPage} setCurrPage={setCurrPage} />
                    <div className={styles.tablesWrapper}>
                        {currPage === 'statistics'
                        ? <StatisticsTable />
                        : <DataTable />}
                    </div>
                </>
                }
            </div>
        </div>
    )
}

export {
    EventsLayout,
}