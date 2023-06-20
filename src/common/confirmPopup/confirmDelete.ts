import { combine, declareAction, declareAtom } from "@reatom/core"
import { GroupFullData } from "../../app/model/guests/groupData"
import { categoryActions } from "../../app/model/hotels/category"
import { usersActions } from "../../app/model/users/users"
import { eventsActions } from "../../app/model/events/events"
import { hotelAtoms, hotelsActions } from "../../app/model/hotels/hotels"
import { groupsActions } from "../../app/model/guests/groups"
import { guestsActions } from "../../app/model/guests/guests"
import { settleActions } from "../../app/model/guests/settle"

type Guest = 'guest'

type Items = 'user' | 'group' | 'hotel' | 'event' | 'category' | 'settlement'

type ItemType = Guest | Items

type OpenPayload = {
    item: Guest,
    parentGroup: GroupFullData,
    id: string,
} | {
    item: Items,
    id: string,
}

const open = declareAction<OpenPayload>('confirmDeletePopup.open')
const close = declareAction('confirmDeletePopup.close')

const openedAtom = declareAtom('confirmDeletePopup.opened', false, on => [
    on(open, () => true),
    on(close, () => false),
    on(usersActions.deleteUser.done, () => false),
    on(eventsActions.deleteEvents.done, () => false),
    on(hotelsActions.deleteHotels.done, () => false),
    on(groupsActions.deleteGroup.done, () => false),
    on(guestsActions.deleteGuest.done, () => false),
    on(settleActions.deleteSettlement.done, () => false),
    on(categoryActions.deleteCategory.done, () => false),
])

const itemAtom = declareAtom<ItemType>('confirmDeletePopup.item', 'user', on => [
    on(open, (_, value) => value.item),
])

const idAtom = declareAtom<string>('confirmDeletePopup.id', '', on => [
    on(open, (_, value) => value.id),
])

const groupAtom = declareAtom<GroupFullData|null>('updateGuestPopup.groupId', null, on => [
    on(open, (_, value) => value.item === 'guest' ? value.parentGroup : null)
])

const loadingAtom = declareAtom<boolean>('confirmDeletePopup.loading', false, on => [
    on(close, () => false),
    on(usersActions.deleteUser, () => true),
    on(usersActions.deleteUser.done, () => false),
    on(usersActions.deleteUser.fail, () => false),
    on(eventsActions.deleteEvents, () => true),
    on(eventsActions.deleteEvents.done, () => false),
    on(eventsActions.deleteEvents.fail, () => false),
    on(hotelsActions.deleteHotels, () => true),
    on(hotelsActions.deleteHotels.done, () => false),
    on(hotelsActions.deleteHotels.fail, () => false),
    on(groupsActions.deleteGroup, () => true),
    on(groupsActions.deleteGroup.done, () => false),
    on(groupsActions.deleteGroup.fail, () => false),
    on(guestsActions.deleteGuest, () => true),
    on(guestsActions.deleteGuest.done, () => false),
    on(guestsActions.deleteGuest.fail, () => false),
    on(settleActions.deleteSettlement, () => true),
    on(settleActions.deleteSettlement.done, () => false),
    on(settleActions.deleteSettlement.fail, () => false),
    on(categoryActions.deleteCategory, () => true),
    on(categoryActions.deleteCategory.done, () => false),
    on(categoryActions.deleteCategory.fail, () => false),
])

const submit = declareAction('confirmDeletePopup.submit',
    (_, store) => {
        const item = store.getState(itemAtom)
        const id = store.getState(idAtom)

        switch (item) {
            case 'user':
                store.dispatch(usersActions.deleteUser(id))
                break
            case 'guest':
                const parentGroup = store.getState(groupAtom)
                parentGroup && store.dispatch(guestsActions.deleteGuest({
                    parentGroup: parentGroup,
                    guestId: id,
                }))
                break
            case 'group':
                store.dispatch(groupsActions.deleteGroup(id))
                break
            case 'hotel':
                store.dispatch(hotelsActions.deleteHotels(id))
                break
            case 'event':
                store.dispatch(eventsActions.deleteEvents(id))
                break
            case 'category':
                const hotelId = store.getState(hotelAtoms).currHotelAtom.id
                store.dispatch(categoryActions.deleteCategory({
                    hotelId,
                    categoryName: id,
                }))
                break
            case 'settlement':
                store.dispatch(settleActions.deleteSettlement(id))
                break
            default:
                break
        }
    }
)

const confirmDeletePopupAtoms = combine({
    openedAtom,
    itemAtom,
    idAtom,
    loadingAtom,
    groupAtom,
})

const confirmDeletePopupActions = {
    open,
    close,
    submit,
}

export type {
    ItemType,
}

export {
    confirmDeletePopupAtoms,
    confirmDeletePopupActions,
}