import { combine, declareAction, declareAtom } from "@reatom/core"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { CurrUserApi } from "../../../api/currUserApi"
import { Toasts } from "../../../common/toasts/toasts"
import { HttpStatus } from "../../../core/http/HttpStatus"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"

type PasswordUpdatePayload = {
    oldPassword: string,
    newPassword: string,
}

const updatePassword = declareAsyncAction<PasswordUpdatePayload>('updatePassword.updatePassword',
    (payload, _) => {
        return CurrUserApi.updatePassword(
            payload.oldPassword,
            payload.newPassword,
        )
        .then(() => {
            Toasts.success('Пароль успешно изменен')
        })
        .catch((response) => {
            switch (response.status) {
                case HttpStatus.FORBIDDEN:
                    Toasts.success('Неверно указан текущий пароль')
                    break
                default:
                    Toasts.success('Не удалось изменить пароль')
                    break
            }
        })
    }
)

const open = declareAction('updatePassword.open')
const close = declareAction('updatePassword.close')

const [openedAtom, setOpened] = declareAtomWithSetter('updatePassword.opened', false, on => [
    on(open, () => true),
    on(close, () => false),
    on(updatePassword.done, () => false),
])

const [userOldPasswordAtom, setUserOldPassword] = declareAtomWithSetter<string>('updatePassword.userOldPassword', '', on => [
    on(open, () => ''),
])

const [userNewPasswordAtom, setUserNewPassword] = declareAtomWithSetter<string>('updatePassword.userNewPassword', '', on => [
    on(open, () => ''),
])

const [userNewPasswordRepeatAtom, setUserNewPasswordRepeat] = declareAtomWithSetter<string>('updatePassword.userNewPasswordRepeat', '', on => [
    on(open, () => ''),
])

const [userNewPasswordErrorAtom, setUserNewPasswordError] = declareAtomWithSetter<string>('updatePassword.userNewPasswordError', '', on => [
    on(setUserNewPassword, () => ''),
    on(setUserNewPasswordRepeat, () => ''),
    on(open, () => '')
])

const submitButtonLoadingAtom = declareAtom<boolean>('updatePassword.submitButtonLoading', false, on => [
    on(updatePassword, () => true),
    on(updatePassword.done, () => false),
    on(updatePassword.fail, () => false),
    on(close, () => false),
])

const submit = declareAction('updatePassword.submit',
    (_, store) => {
        const userOldPassword = store.getState(userOldPasswordAtom)
        const userNewPassword = store.getState(userNewPasswordAtom)
        const userNewPasswordRepeat = store.getState(userNewPasswordRepeatAtom)

        const userNewPasswordError = userNewPassword !== userNewPasswordRepeat

        if (userNewPasswordError) {
            store.dispatch(setUserNewPasswordError('Пароли должны совпадать'))
            return
        }

        store.dispatch(updatePassword({
            oldPassword: userOldPassword,
            newPassword: userNewPassword,
        }))
    }
)

const updatePasswordPopupAtoms = combine({
    openedAtom,
    userOldPasswordAtom,
    userNewPasswordAtom,
    userNewPasswordRepeatAtom,
    userNewPasswordErrorAtom,
    submitButtonLoadingAtom,
})

const updatePasswordPopupActions = {
    open,
    close,
    setOpened,
    setUserOldPassword,
    setUserNewPassword,
    setUserNewPasswordRepeat,
    setUserNewPasswordError,
    submit,
}

export {
    updatePasswordPopupAtoms,
    updatePasswordPopupActions,
}