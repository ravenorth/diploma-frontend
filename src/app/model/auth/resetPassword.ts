import { combine, declareAtom } from "@reatom/core"
import { Toasts } from "../../../common/toasts/toasts"
import { HttpStatus } from "../../../core/http/HttpStatus"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { ResetPasswordApi } from "../../../api/resetPasswordApi"

const [openedAtom, setOpened] = declareAtomWithSetter<boolean>('resetPassword.opened', false)

const sendCode = declareAsyncAction<string>(
    'resetPassword.sendCode',
    async (email, _) => {
        return ResetPasswordApi.sendCode(email)
            .then(response => {
                return Promise.resolve()
            })
            .catch(err => {
                switch (err.status) {
                    case HttpStatus.UNAUTHORIZED:
                        Toasts.error('Не удалось найти пользователя с таким email')
                        return Promise.reject(err)
                    default:
                        Toasts.error('Не удалось отправить код')
                        return Promise.reject(err)
                }
                
            })
    }
)

const verifyCode = declareAsyncAction<{email: string, code: string}>(
    'resetPassword.verifyCode',
    async ({email, code}, _) => {
        return ResetPasswordApi.verifyCode(email, code)
            .then(response => {
                return Promise.resolve()
            })
            .catch(err => {
                switch (err.status) {
                    case HttpStatus.UNAUTHORIZED:
                        Toasts.error('Неверный код')
                        return Promise.reject(err)
                    default:
                        Toasts.error('Не удалось отправить код')
                        return Promise.reject(err)
                }
            })
    }
)

const resetPassword = declareAsyncAction<{email: string, newPassword: string, newPasswordRepeat: string}>(
    'resetPassword.resetPassword',
    async ({email, newPassword, newPasswordRepeat}, store) => {
        if (newPassword !== newPasswordRepeat) {
            Toasts.error('Пароли должны совпадать')
            return Promise.reject('Пароли должны совпадать')
        }

        return ResetPasswordApi.resetPassword(email, newPassword)
            .then(response => {
                return Promise.resolve()
            })
            .catch(err => {
                Toasts.error('Не удалось обновить пароль')
                return Promise.reject(err)
            })
    }
)

const [emailAtom, setEmail] = declareAtomWithSetter<string>('resetPassword.email', '')

const [codeAtom, setCode] = declareAtomWithSetter<string>('resetPassword.code', '')

const [newPasswordAtom, setNewPassword] = declareAtomWithSetter<string>('resetPassword.newPassword', '')

const [newPasswordRepeatAtom, setNewPasswordRepeat] = declareAtomWithSetter<string>('resetPassword.newPasswordRepeat', '')

const stateAtom = declareAtom<number>('resetPassword.state', 0, on => [
    on(sendCode.done, () => 1),
    on(verifyCode.done, () => 2),
    on(resetPassword.done, () => 0),
])

const resetButtonLoadingAtom = declareAtom<boolean>('resetPassword.resetButtonLoading', false, on => [
    on(sendCode, () => true),
    on(sendCode.done, () => false),
    on(sendCode.fail, () => false),
    on(verifyCode, () => true),
    on(verifyCode.done, () => false),
    on(verifyCode.fail, () => false),
    on(resetPassword, () => true),
    on(resetPassword.done, () => false),
    on(resetPassword.fail, () => false),
])

const resetPasswordAtoms = combine({
    openedAtom,
    emailAtom,
    newPasswordAtom,
    newPasswordRepeatAtom,
    codeAtom,
    stateAtom,
    resetButtonLoadingAtom,
})

const resetPasswordActions = {
    setOpened,
    setEmail,
    setNewPassword,
    setNewPasswordRepeat,
    sendCode,
    setCode,
    verifyCode,
    resetPassword,
}

export {
    resetPasswordAtoms,
    resetPasswordActions,
}