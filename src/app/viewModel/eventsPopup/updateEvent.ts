import { combine, declareAction, declareAtom } from "@reatom/core"
import dayjs, { Dayjs } from "dayjs"
import { EventFullData } from "../../model/events/eventData"
import { eventsActions } from "../../model/events/events"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { validateNotEmptyValue } from "../../../core/validator/validator"

type ModeType = 'create' | 'edit'

type OpenPayload = {
    mode: 'create',
} | {
    mode: 'edit',
    data: EventFullData,
}

const open = declareAction<OpenPayload>('updateEventPopup.open')
const close = declareAction('updateEventPopup.close')

const openedAtom = declareAtom('updateEventPopup.opened', false, on => [
    on(open, () => true),
    on(close, () => false),
    on(eventsActions.createEvent.done, () => false),
    on(eventsActions.editEvent.done, () => false),
])

const popupModeAtom = declareAtom<ModeType>('updateEventPopup.popupMode', 'edit', on => [
    on(open, (_, value) => value.mode)
])

const idAtom = declareAtom<string|null>('updateEventPopup.id', null, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.id : null)
])

const [nameAtom, setName] = declareAtomWithSetter<string>('updateEventPopup.name', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.name : ''),
])

const [startAtom, setStart] = declareAtomWithSetter<Dayjs>('updateEventPopup.start', dayjs(), on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.start : dayjs()),
])

const [endAtom, setEnd] = declareAtomWithSetter<Dayjs>('updateEventPopup.end', dayjs(), on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.end : dayjs()),
])

const [nameErrorAtom, setNameError] = declareAtomWithSetter<string>('updateEventPopup.nameError', '', on => [
    on(setName, () => ''),
    on(open, () => '')
])

const loadingAtom = declareAtom<boolean>('updateEventPopup.loading', false, on => [
    on(eventsActions.createEvent, () => true),
    on(eventsActions.createEvent.done, () => false),
    on(eventsActions.createEvent.fail, () => false),
    on(eventsActions.editEvent, () => true),
    on(eventsActions.editEvent.done, () => false),
    on(eventsActions.editEvent.fail, () => false),
    on(close, () => false),
])

const submit = declareAction('updateEventPopup.submit',
    (_, store) => {
        const popupMode = store.getState(popupModeAtom)
        const name = store.getState(nameAtom)
        const start = store.getState(startAtom)
        const end = store.getState(endAtom)
        const nameError = validateNotEmptyValue(name)

        if (nameError) {
            store.dispatch(setNameError(nameError))
            return
        }

        if (popupMode === 'create') {
            store.dispatch(eventsActions.createEvent({
                name,
                start,
                end,
            }))
        }
        else {
            const id = store.getState(idAtom)
            if (id) store.dispatch(eventsActions.editEvent({
                id,
                name,
                start,
                end,
            }))
        }
    }
)

const updateEventPopupAtoms = combine({
    popupModeAtom,
    openedAtom,
    idAtom,
    nameAtom,
    startAtom,
    endAtom,
    nameErrorAtom,
    loadingAtom,
})

const updateEventPopupActions = {
    open,
    close,
    setName,
    setStart,
    setEnd,
    setNameError,
    submit,
}

export {
    updateEventPopupAtoms,
    updateEventPopupActions,
}