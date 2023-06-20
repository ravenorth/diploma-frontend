import { combine } from "@reatom/core"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { UserData } from "./userData"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { UsersApi } from "../../../api/usersApi"
import { Toasts } from "../../../common/toasts/toasts"

const [managerOptionsAtom, setManagerOptions] = declareAtomWithSetter<UserData[]>('usersOptions.managerOptions', [], on => [
    //on(updateGroupPopupActions.close, () => []),
])

const [hotelUsersOptionsAtom, setHotelUsersrOptions] = declareAtomWithSetter<UserData[]>('usersOptions.hotelUsersOptions', [], on => [
    //on(updateGroupPopupActions.close, () => []),
])

const getManagers = declareAsyncAction<void>('usersOptions.getManagers',
    (_, store) => {
        return UsersApi.getManagers()
            .then(managers => {
                store.dispatch(setManagerOptions(managers))
            })
            .catch(() => {
                Toasts.error('При получении списка менеджеров произошла ошибка')
            })
    }
)

const getHotelUsers = declareAsyncAction<void>('usersOptions.getHotelUsers',
    (_, store) => {
        return UsersApi.getAllHotelUsers()
            .then(hotelUsers => {
                store.dispatch(setHotelUsersrOptions(hotelUsers))
            })
            .catch(() => {
                Toasts.error('При получении списка менеджеров произошла ошибка')
            })
    }
)

const usersOptionsAtoms = combine({
    managerOptionsAtom,
    hotelUsersOptionsAtom,
})

const usersOptionsActions = {
    getManagers,
    getHotelUsers,
}

export {
    usersOptionsAtoms,
    usersOptionsActions,
}