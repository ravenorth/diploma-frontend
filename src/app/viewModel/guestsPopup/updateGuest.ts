import { combine, declareAction, declareAtom } from "@reatom/core"
import { GroupFullData } from "../../model/guests/groupData"
import { GuestFullData } from "../../model/guests/guestData"
import { guestsActions } from "../../model/guests/guests"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { usersOptionsActions } from "../../model/users/usersOptions"
import { validateNotEmptyValue } from "../../../core/validator/validator"

type ModeType = 'create' | 'edit'

type OpenPayload = {
    mode: 'create',
    parentGroup: GroupFullData,
} | {
    mode: 'edit',
    parentGroup: GroupFullData,
    data: GuestFullData,
}

const open = declareAction<OpenPayload>('updateGuestPopup.open')
const close = declareAction('updateGuestPopup.close')

const openedAtom = declareAtom('updateGuestPopup.opened', false, on => [
    on(open, () => true),
    on(close, () => false),
    on(guestsActions.createGuest.done, () => false),
    on(guestsActions.editGuest.done, () => false),
])

const popupModeAtom = declareAtom<ModeType>('updateGuestPopup.popupMode', 'edit', on => [
    on(open, (_, value) => value.mode)
])

const idAtom = declareAtom<string|null>('updateGuestPopup.id', null, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.id : null)
])

const groupAtom = declareAtom<GroupFullData>('updateGuestPopup.groupId', {} as GroupFullData, on => [
    on(open, (_, value) => value.parentGroup)
])

const [nameAtom, setName] = declareAtomWithSetter<string>('updateGuestPopup.name', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.fullName : ''),
])

const [contactAtom, setContact] = declareAtomWithSetter<string>('updateGuestPopup.contact', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.contact : ''),
])

const [nameErrorAtom, setNameError] = declareAtomWithSetter<string>('updateGuestPopup.nameError', '', on => [
    on(setName, () => ''),
    on(open, () => '')
])

const loadingAtom = declareAtom<boolean>('updateGuestPopup.loading', false, on => [
    on(guestsActions.createGuest, () => true),
    on(guestsActions.createGuest.done, () => false),
    on(guestsActions.createGuest.fail, () => false),
    on(guestsActions.editGuest, () => true),
    on(guestsActions.editGuest.done, () => false),
    on(guestsActions.editGuest.fail, () => false),
    on(usersOptionsActions.getManagers, () => true),
    on(usersOptionsActions.getManagers.done, () => false),
    on(usersOptionsActions.getManagers.fail, () => false),
    on(close, () => false),
])

const submit = declareAction('updateGuestPopup.submit',
    (_, store) => {
        const popupMode = store.getState(popupModeAtom)
        const parentGroup = store.getState(groupAtom)
        const fullName = store.getState(nameAtom)
        const contact = store.getState(contactAtom)
        const nameError = validateNotEmptyValue(fullName)

        if (nameError) {
            store.dispatch(setNameError(nameError))
            return
        }

        if (popupMode === 'create') {
            store.dispatch(guestsActions.createGuest({
                parentGroup,
                guestData: {
                    fullName,
                    contact,
                }
            }))
        }
        else {
            const id = store.getState(idAtom)
            if (id) store.dispatch(guestsActions.editGuest({
                parentGroup,
                guestData: {
                    id,
                    fullName,
                    contact,
                }
            }))
        }
    }
)

const updateGuestPopupAtoms = combine({
    popupModeAtom,
    openedAtom,
    idAtom,
    nameAtom,
    groupAtom,
    contactAtom,
    nameErrorAtom,
    loadingAtom,
})

const updateGuestPopupActions = {
    open,
    close,
    setName,
    setContact,
    setNameError,
    submit,
}

export {
    updateGuestPopupAtoms,
    updateGuestPopupActions,
}