import { combine, declareAction, declareAtom } from "@reatom/core"
import { eventListActions } from "./eventList"
import dayjs from "dayjs"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { EventFullData, JournalData, JournalStatistic } from "./eventData"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { EventsApi } from "../../../api/eventsApi"
import { Toasts } from "../../../common/toasts/toasts"
import { ExportToCsv } from "export-to-csv"

const [currEventIdAtom, setCurrEventId] = declareAtomWithSetter<string>('events.currEventId', '')

const [currEventAtom, setCurrEvent] = declareAtomWithSetter<EventFullData>('events.currEvent', {} as EventFullData)

const [journalStatisticAtom, setJournalStatistic] = declareAtomWithSetter<JournalStatistic[]>('events.journalStatistic', [])

const [journalDataAtom, setJournalData] = declareAtomWithSetter<JournalData[]>('events.journalData', [])

const getEventData = declareAsyncAction<string>('events.getEventData',
    (eventId, store) => {
        return EventsApi.getEventData(eventId)
            .then(eventData => {
                store.dispatch(setCurrEvent({
                    ...eventData,
                    start: dayjs(eventData.dateOfStart),
                    end: dayjs(eventData.dateOfEnd),
                }))
            })
            .catch(() => {
                Toasts.error('При получении данных о мероприятии произошла ошибка')
            })
    }
)

const getEvents = declareAsyncAction<void>('events.getEvents',
    (_, store) => {
        return EventsApi.getEvents()
            .then(events => {
                store.dispatch(eventListActions.clearEvents())
                if (events.length) {
                    store.dispatch(eventListActions.updateEvents(events))
                    store.dispatch(setCurrEventId(events[0].id))
                }
            })
            .catch(() => {
                Toasts.error('При получении списка мероприятий произошла ошибка')
            })
    }
)

const createEvent = declareAsyncAction<Omit<EventFullData, 'id'>>('events.create',
    (eventData, store) => {
        return EventsApi.createEvent(eventData)
            .then(({id}) => {
                Toasts.success('Мероприятие успешно создано')
                store.dispatch(eventListActions.updateEvent({
                    id,
                    ...eventData,
                }))
                store.dispatch(setCurrEventId(id))
            })
            .catch(() => {
                Toasts.error('При создании мероприятия произошла ошибка')
            })
    }
)

const editEvent = declareAsyncAction<EventFullData>('events.edit',
    (event, store) => {
        return EventsApi.editEvent(event)
            .then(() => {
                Toasts.success('Мероприятие успешно изменено')
                store.dispatch(eventListActions.updateEvent(event))
                store.dispatch(setCurrEventId(event.id))
            })
            .catch(() => {
                Toasts.error('При изменении мероприятия произошла ошибка')
            })
    }
)

const deleteEvents = declareAsyncAction<string>('events.delete',
    (id, store) => {
        return EventsApi.deleteEvent(id)
            .then(() => {
                Toasts.success('Мероприятие успешно удалено')
                store.dispatch(getEvents())
            })
            .catch(() => {
                Toasts.error('При удалении мероприятия произошла ошибка')
            })
    }
)

const getJournalStatistic = declareAsyncAction<string>('events.getJournalStatistic',
    (eventId, store) => {
        return EventsApi.getJournalStatistic(eventId)
            .then(table => {
                store.dispatch(setJournalStatistic(table))
            })
            .catch(() => {
                Toasts.error('При получении таблицы статистики произошла ошибка')
            })
    }
)

const getJournalData = declareAsyncAction<string>('events.getJournalData',
    (eventId, store) => {
        return EventsApi.getJournalData(eventId)
            .then(table => {
                store.dispatch(setJournalData(table.map(item => ({
                    ...item,
                    checkin: dayjs(item.checkin),
                    checkout: dayjs(item.checkout),
                }))))
            })
            .catch(() => {
                Toasts.error('При получении таблицы данных произошла ошибка')
            })
    }
)

const exportTable = declareAction<string>('events.exportTable',
    (currPage, store) => {
        const data = currPage === 'statistics'
            ? store.getState(journalStatisticAtom)
            : store.getState(journalDataAtom)

        const options = {
            filename: currPage,
            fieldSeparator: ',',
            decimalSeparator: '.',
            showTitle: true,
            title: currPage,
            useKeysAsHeaders: true,
            // headers: ['Column 1', 'Column 2'],
        }
        const csvExporter = new ExportToCsv(options)
        csvExporter.generateCsv(data);

        let hiddenElement = document.createElement('a')
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvExporter.toString()) 
        hiddenElement.target = '_blank'
        hiddenElement.download = `${currPage}.csv`
    }
)

const eventDataLoadingAtom = declareAtom('events.dataLoading', true, on => [
    on(getEventData, () => true),
    on(getEventData.done, () => false),
    on(getEventData.fail, () => false),
    on(createEvent, () => true),
    on(createEvent.done, () => false),
    on(createEvent.fail, () => false),
    on(editEvent, () => true),
    on(editEvent.done, () => false),
    on(editEvent.fail, () => false),
    on(deleteEvents, () => true),
    on(deleteEvents.done, () => false),
    on(deleteEvents.fail, () => false),
    on(getJournalStatistic, () => true),
    on(getJournalStatistic.done, () => false),
    on(getJournalStatistic.fail, () => false),
    on(getJournalData, () => true),
    on(getJournalData.done, () => false),
    on(getJournalData.fail, () => false),
])

const eventsLoadingAtom = declareAtom('events.loading', true, on => [
    on(getEvents, () => true),
    on(getEvents.done, () => false),
    on(getEvents.fail, () => false),
])

const eventsAtoms = combine({
    eventsLoadingAtom,
    currEventIdAtom,
    currEventAtom,
    eventDataLoadingAtom,
    journalStatisticAtom,
    journalDataAtom,
})

const eventsActions = {
    getEvents,
    createEvent,
    editEvent,
    deleteEvents,
    setCurrEventId,
    setCurrEvent,
    getEventData,
    getJournalStatistic,
    getJournalData,
    exportTable,
}

export {
    eventsActions,
    eventsAtoms,
}