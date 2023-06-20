import { combine, declareAction, declareAtom } from "@reatom/core"
import dayjs, { Dayjs } from "dayjs"
import { GroupFullData } from "../../model/guests/groupData"
import { groupsActions } from "../../model/guests/groups"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { CategoryType } from "../../model/hotels/categoryData"
import { UserData } from "../../model/users/userData"
import { GuestFullData } from "../../model/guests/guestData"
import { usersOptionsActions } from "../../model/users/usersOptions"
import { currUserAtom } from "../../model/currUser/currUser"
import { validateNotEmptyValue } from "../../../core/validator/validator"
import { eventsAtoms } from "../../model/events/events"

type ModeType = 'create' | 'edit'

type OpenPayload = {
    mode: 'create',
} | {
    mode: 'edit',
    data: GroupFullData,
}

const open = declareAction<OpenPayload>('updateGroupPopup.open')
const close = declareAction('updateGroupPopup.close')

const openedAtom = declareAtom('updateGroupPopup.opened', false, on => [
    on(open, () => true),
    on(close, () => false),
    on(groupsActions.createGroup.done, () => false),
    on(groupsActions.editGroup.done, () => false),
])

const popupModeAtom = declareAtom<ModeType>('updateGroupPopup.popupMode', 'edit', on => [
    on(open, (_, value) => value.mode)
])

const idAtom = declareAtom<string|null>('updateGroupPopup.id', null, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.id : null)
])

const [nameAtom, setName] = declareAtomWithSetter<string>('updateGroupPopup.name', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.name : ''),
])

const [checkinAtom, setCheckin] = declareAtomWithSetter<Dayjs>('updateGroupPopup.checkin', dayjs(), on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.checkin : dayjs()),
])

const [checkoutAtom, setCheckout] = declareAtomWithSetter<Dayjs>('updateGroupPopup.checkout', dayjs(), on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.checkout : dayjs()),
])

const [preferredCategoryAtom, setPreferredCategory] = declareAtomWithSetter<CategoryType>('updateGroupPopup.preferredCategory', 1, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.preferredCategory : 1),
])

const [managerAtom, setManager] = declareAtomWithSetter<UserData|null>('updateGroupPopup.manager', null, on => [
    on(open, (_, value) => (value.mode === 'edit' ? value.data.manager : null) || null),
])

const statusAtom = declareAtom<boolean>('updateGroupPopup.guests', false, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.status : false),
])

const guestsAtom = declareAtom<GuestFullData[]>('updateGroupPopup.guests', [], on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.guests : []),
])

const [nameErrorAtom, setNameError] = declareAtomWithSetter<string>('updateGroupPopup.nameError', '', on => [
    on(setName, () => ''),
    on(open, () => '')
])

const [datesErrorAtom, setDatesError] = declareAtomWithSetter<string>('updateGroupPopup.datesError', '', on => [
    on(setCheckin, () => ''),
    on(setCheckout, () => ''),
    on(open, () => '')
])

const loadingAtom = declareAtom<boolean>('updateGroupPopup.loading', false, on => [
    on(groupsActions.createGroup, () => true),
    on(groupsActions.createGroup.done, () => false),
    on(groupsActions.createGroup.fail, () => false),
    on(groupsActions.editGroup, () => true),
    on(groupsActions.editGroup.done, () => false),
    on(groupsActions.editGroup.fail, () => false),
    on(usersOptionsActions.getManagers, () => true),
    on(usersOptionsActions.getManagers.done, () => false),
    on(usersOptionsActions.getManagers.fail, () => false),
    on(close, () => false),
])

const submit = declareAction('updateGroupPopup.submit',
    (_, store) => {
        const currUser = store.getState(currUserAtom)
        const currEvent = store.getState(eventsAtoms).currEventAtom
        const popupMode = store.getState(popupModeAtom)
        const name = store.getState(nameAtom)
        const checkin = store.getState(checkinAtom)
        const checkout = store.getState(checkoutAtom)
        const preferredCategory = store.getState(preferredCategoryAtom)
        const manager = store.getState(managerAtom)
        const status = store.getState(statusAtom)

        const nameError = validateNotEmptyValue(name)
        const datesError = (checkin < currEvent.start) || (checkout > currEvent.end)
            ? 'Не соответсвует датам проведения мероприятия'
            : ''

        if (nameError || datesError) {
            store.dispatch(setNameError(nameError))
            store.dispatch(setDatesError(datesError))
            return
        }

        if (popupMode === 'create') {
            const currEventId = store.getState(eventsAtoms).currEventIdAtom
            const groupManager = currUser?.role === 'manager' ? currUser : manager
            store.dispatch(groupsActions.createGroup({
                eventId: currEventId,
                groupData: {
                    name,
                    checkin,
                    checkout,
                    preferredCategory,
                    manager: groupManager || undefined,
                    status,
                }
            }))
        }
        else {
            const id = store.getState(idAtom)
            const guests = store.getState(guestsAtom)
            if (id) store.dispatch(groupsActions.editGroup({
                id,
                name,
                checkin,
                checkout,
                preferredCategory,
                manager: manager || undefined,
                guests,
                status,
            }))
        }
    }
)

const updateGroupPopupAtoms = combine({
    popupModeAtom,
    openedAtom,
    idAtom,
    nameAtom,
    checkinAtom,
    checkoutAtom,
    preferredCategoryAtom,
    managerAtom,
    guestsAtom,
    statusAtom,
    nameErrorAtom,
    datesErrorAtom,
    loadingAtom,
})

const updateGroupPopupActions = {
    open,
    close,
    setName,
    setCheckin,
    setCheckout,
    setPreferredCategory,
    setManager,
    setNameError,
    submit,
}

export {
    updateGroupPopupAtoms,
    updateGroupPopupActions,
}