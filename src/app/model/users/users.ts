import { declareAtom } from "@reatom/core"
import { userListActions } from "./userList"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { UsersApi } from "../../../api/usersApi"
import { remapApiRole } from "./userRole"
import { Toasts } from "../../../common/toasts/toasts"
import { UserFullData } from "./userData"

const getUsers = declareAsyncAction<void>('users.get',
    (_, store) => {
        return UsersApi.getUsers()
            .then(users => {
                store.dispatch(userListActions.clearUsers())
                store.dispatch(userListActions.updateUsers(users.map(item => ({
                    ...item,
                    role: remapApiRole(item.role),
                }))))
            })
            .catch(() => {
                Toasts.error('При получении списка пользователей произошла ошибка')
            })
    }
)

const createUser = declareAsyncAction<Omit<UserFullData, 'id'>>('users.create',
    (user, store) => {
        return UsersApi.createUser(user)
            .then(({id}) => {
                Toasts.success('Пользователь успешно создан')
                store.dispatch(userListActions.updateUser({
                    id,
                    ...user
                }))
            })
            .catch(() => {
                Toasts.error('При создании пользователя произошла ошибка')
            })
    }
)

const editUser = declareAsyncAction<UserFullData>('users.edit',
    (user, store) => {
        return UsersApi.editUser({
            id: user.id,
            role: user.role,
            fullName: user.fullName,
            email: user.email,
        })
            .then(() => {
                Toasts.success('Пользователь успешно изменен')
                store.dispatch(userListActions.updateUser(user))
            })
            .catch(() => {
                Toasts.error('При изменении пользователя произошла ошибка')
            })
    }
)

const deleteUser = declareAsyncAction<string>('users.delete',
    (id, store) => {
        return UsersApi.deleteUser(id)
            .then(() => {
                Toasts.success('Пользователь успешно удален')
                store.dispatch(userListActions.removeUser([id]))
            })
            .catch(() => {
                Toasts.error('При удалении пользователя произошла ошибка')
            })
    }
)

const usersLoadingAtom = declareAtom('users.loading', true, on => [
    on(getUsers, () => true),
    on(getUsers.done, () => false),
    on(getUsers.fail, () => false),
])

const usersActions = {
    getUsers,
    createUser,
    editUser,
    deleteUser,
    usersLoadingAtom,
}

export {
    usersActions,
    usersLoadingAtom,
}