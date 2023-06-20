import { combine, declareAction, declareAtom } from "@reatom/core"
import { UserFullData } from "../../model/users/userData"
import { usersActions } from "../../model/users/users"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { UserRole } from "../../model/users/userRole"
import { validateEmail, validateNotEmptyValue } from "../../../core/validator/validator"

type ModeType = 'create' | 'edit'

type OpenPayload = {
    mode: 'create',
} | {
    mode: 'edit',
    data: UserFullData,
}

const open = declareAction<OpenPayload>('updateUserPopup.open')
const close = declareAction('updateUserPopup.close')

const openedAtom = declareAtom('updateUserPopup.opened', false, on => [
    on(open, () => true),
    on(close, () => false),
    on(usersActions.createUser.done, () => false),
    on(usersActions.editUser.done, () => false),
])

const popupModeAtom = declareAtom<ModeType>('updateUserPopup.popupMode', 'edit', on => [
    on(open, (_, value) => value.mode)
])

const idAtom = declareAtom<string|null>('updateUserPopup.id', null, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.id : null)
])

const [fullNameAtom, setFullName] = declareAtomWithSetter<string>('updateUserPopup.fullName', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.fullName : ''),
])

const [roleAtom, setRole] = declareAtomWithSetter<UserRole>('updateUserPopup.role', 'manager', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.role : 'manager'),
])

const [emailAtom, setEmail] = declareAtomWithSetter<string>('updateUserPopup.email', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.email : ''),
])

const [fullNameErrorAtom, setFullNameError] = declareAtomWithSetter<string>('updateUserPopup.fullNameError', '', on => [
    on(setFullName, () => ''),
    on(open, () => '')
])

const [emailErrorAtom, setEmailError] = declareAtomWithSetter<string>('updateUserPopup.emailError', '', on => [
    on(setEmail, () => ''),
    on(open, () => '')
])

const loadingAtom = declareAtom<boolean>('updateUserPopup.loading', false, on => [
    on(usersActions.createUser, () => true),
    on(usersActions.createUser.done, () => false),
    on(usersActions.createUser.fail, () => false),
    on(usersActions.editUser, () => true),
    on(usersActions.editUser.done, () => false),
    on(usersActions.editUser.fail, () => false),
    on(close, () => false),
])

const submit = declareAction('updateUserPopup.submit',
    (_, store) => {
        const popupMode = store.getState(popupModeAtom)

        const fullName = store.getState(fullNameAtom)
        const role = store.getState(roleAtom)
        const email = store.getState(emailAtom)

        const fullNameError = validateNotEmptyValue(fullName)
        const emailError = validateEmail(email)

        if (fullNameError || emailError) {
            store.dispatch(setFullNameError(fullNameError))
            store.dispatch(setEmailError(emailError))
            return
        }

        if (popupMode === 'create') {
            store.dispatch(usersActions.createUser({
                fullName,
                role,
                email,
            }))
        }
        else {
            const id = store.getState(idAtom)
            if (id) store.dispatch(usersActions.editUser({
                id,
                fullName,
                role,
                email,
            }))
        }
    }
)

const updateUserPopupAtoms = combine({
    popupModeAtom,
    openedAtom,
    idAtom,
    fullNameAtom,
    roleAtom,
    emailAtom,
    fullNameErrorAtom,
    emailErrorAtom,
    loadingAtom,
})

const updateUserPopupActions = {
    open,
    close,
    setFullName,
    setEmail,
    setRole,
    setFullNameError,
    setEmailError,
    submit,
}

export {
    updateUserPopupAtoms,
    updateUserPopupActions,
}