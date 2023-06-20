import { declareAtom } from "@reatom/core"
import { CurrUserApi } from "../../../api/currUserApi"
import { tokenHandler } from "../../../core/localStorage/token"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { UserFullData } from "../users/userData"
import { remapApiRole } from "../users/userRole"

const initUser = declareAsyncAction<void>(
    'initUser',
    async (_, store) => {
        if (tokenHandler.get()) {
            return CurrUserApi.initUser()
                .then(response => {
                    store.dispatch(setCurrUser({
                        id: response.id,
                        role: remapApiRole(response.role),
                        fullName: response.fullName,
                        email: response.email,
                    }))
                    
                    return Promise.resolve()
                })
                .catch(err => {
                    tokenHandler.remove()
                    return Promise.reject(err)
                })
        }

        return Promise.reject()
    }
)

const [currUserAtom, setCurrUser] = declareAtomWithSetter<UserFullData|null>('currUser', null)

const initUserLoadingAtom = declareAtom<boolean>('initUserLoading', true, on => [
    on(initUser.done, () => false),
    on(initUser.fail, () => false),
])

export {
    currUserAtom,
    setCurrUser,
    initUser,
    initUserLoadingAtom,
}