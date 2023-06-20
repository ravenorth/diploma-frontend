import { combine, declareAction, declareAtom } from "@reatom/core"
import { AuthApi } from "../../../api/authApi"
import { Toasts } from "../../../common/toasts/toasts"
import { HttpStatus } from "../../../core/http/HttpStatus"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { tokenHandler } from "../../../core/localStorage/token"
import { setCurrUser } from "../currUser/currUser"
import { Login_ApiPayload } from "../../../api/apiData"
import { remapApiRole } from "../users/userRole"

const login = declareAsyncAction<Login_ApiPayload>(
    'auth.login',
    async (userFullData, store) => {
        return AuthApi.logIn(userFullData)
            .then(response => {
                tokenHandler.set(response.id)
                store.dispatch(setCurrUser({
                    id: response.id,
                    role: remapApiRole(response.role),
                    fullName: response.fullName,
                    email: response.email,
                }))
                return Promise.resolve()
            })
            .catch(err => {
                switch (err.status) {
                    case HttpStatus.UNAUTHORIZED:
                        Toasts.error('Введен неверный email и/или пароль')
                        break
                    default:
                        Toasts.error('Не удалось выполнить вход')
                        break
                }
                
                return Promise.reject(err)
            })
    }
)

const logout = declareAsyncAction<void>(
    'auth.logout',
    async (_, store) => {
        store.dispatch(setCurrUser(null))
        tokenHandler.remove()

        return AuthApi.logOut()
            .then(response => {
                return Promise.resolve()
            })
            .catch(err => {
                //Toasts.error('Не удалось выйти из системы')
                return Promise.reject(err)
            })
    }
)

const [emailAtom, setEmail] = declareAtomWithSetter<string>('auth.email', '')

const [passwordAtom, setPassword] = declareAtomWithSetter<string>('auth.password', '')

const toggleRememberMe = declareAction('auth.toggleRememberMe')

const rememberMeAtom = declareAtom<boolean>('auth.rememberMe', false, on => [
    on(toggleRememberMe, (state) => !state),
])

const loginButtonLoadingAtom = declareAtom('auth.loginButtonLoading', false, on => [
    on(login, () => true),
    on(login.done, () => false),
    on(login.fail, () => false),
])

const authAtoms = combine({
    emailAtom,
    passwordAtom,
    loginButtonLoadingAtom,
    rememberMeAtom,
})

const authActions = {
    logout,
    login,
    setEmail,
    setPassword,
    toggleRememberMe,
}

export {
    authAtoms,
    authActions,
}