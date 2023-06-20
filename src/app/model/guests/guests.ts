import { declareAtom } from "@reatom/core"
import { groupListActions } from "./groupList"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { CreateGuest_ApiPayload, DeleteGuest_ApiPayload, EditGuest_ApiPayload } from "../../../api/apiData"
import { GuestsApi } from "../../../api/guestsApi"
import { Toasts } from "../../../common/toasts/toasts"
import { removeItemById, replaceItemById } from "../../../core/utils/array"
import { GuestFullData } from "./guestData"

const createGuest = declareAsyncAction<CreateGuest_ApiPayload>('guests.create',
    ({parentGroup, guestData}, store) => {
        return GuestsApi.createGuest(parentGroup.id, guestData)
            .then(({id}) => {
                Toasts.success('Гость успешно добавлен')
                store.dispatch(groupListActions.updateGroup({
                    ...parentGroup,
                    guests: [...parentGroup.guests, {...guestData, id}]
                }))
            })
            .catch(() => {
                Toasts.error('При добавлении гостя произошла ошибка')
            })
    }
)

const editGuest = declareAsyncAction<EditGuest_ApiPayload>('guests.edit',
    ({parentGroup, guestData}, store) => {
        return GuestsApi.editGuest(guestData)
            .then(() => {
                Toasts.success('Гость успешно изменен')
                store.dispatch(groupListActions.updateGroup({
                    ...parentGroup,
                    guests: replaceItemById(parentGroup.guests, guestData.id, guestData) as GuestFullData[]
                }))
            })
            .catch(() => {
                Toasts.error('При изменении гостя произошла ошибка')
            })
    }
)

const deleteGuest = declareAsyncAction<DeleteGuest_ApiPayload>('guests.delete',
    ({parentGroup, guestId}, store) => {
        return GuestsApi.deleteGuest(guestId)
            .then(() => {
                store.dispatch(groupListActions.updateGroup({
                    ...parentGroup,
                    guests: removeItemById(parentGroup.guests, guestId) as GuestFullData[]
                }))
                Toasts.success('Гость успешно удален')
            })
            .catch(() => {
                Toasts.error('При удалении гостя произошла ошибка')
            })
    }
)

const guestsLoadingAtom = declareAtom('guests.loading', true, on => [
    on(createGuest, () => true),
    on(createGuest.done, () => false),
    on(createGuest.fail, () => false),
    on(editGuest, () => true),
    on(editGuest.done, () => false),
    on(editGuest.fail, () => false),
    on(deleteGuest, () => true),
    on(deleteGuest.done, () => false),
    on(deleteGuest.fail, () => false),
])

const guestsActions = {
    createGuest,
    editGuest,
    deleteGuest,
}

export {
    guestsActions,
    guestsLoadingAtom,
}