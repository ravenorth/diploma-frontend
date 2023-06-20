import { declareAtom } from "@reatom/core"
import { groupListActions } from "./groupList"
import dayjs from "dayjs"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { GroupsApi } from "../../../api/groupsApi"
import { Toasts } from "../../../common/toasts/toasts"
import { CreateGroup_ApiPayload } from "../../../api/apiData"
import { GroupFullData } from "./groupData"

const getGroups = declareAsyncAction<string>('groups.getGroups',
    (eventId, store) => {
        return GroupsApi.getGroups(eventId)
            .then(groups => {
                store.dispatch(groupListActions.clearGroups())
                store.dispatch(groupListActions.updateGroups(groups.map(item => ({
                    ...item,
                    checkin: dayjs(item.dateOfStart),
                    checkout: dayjs(item.dateOfEnd),
                    preferredCategory: item.preferredType,
                    guests: item.settlers,
                }))))
            })
            .catch(() => {
                Toasts.error('При получении списка групп произошла ошибка')
            })
    }
)

const createGroup = declareAsyncAction<CreateGroup_ApiPayload>('groups.create',
    ({eventId, groupData}, store) => {
        return GroupsApi.createGroup(eventId, groupData)
            .then(({id}) => {
                Toasts.success('Группа успешно создана')
                store.dispatch(groupListActions.updateGroup({
                    ...groupData,
                    id,
                    guests: [],
                }))
            })
            .catch(() => {
                Toasts.error('При создании группы произошла ошибка')
            })
    }
)

const editGroup = declareAsyncAction<GroupFullData>('groups.edit',
    (group, store) => {
        return GroupsApi.editGroup(group)
            .then(() => {
                store.dispatch(groupListActions.updateGroup({
                    ...group,
                }))
                Toasts.success('Группа успешно изменена')
            })
            .catch(() => {
                Toasts.error('При изменении группы произошла ошибка')
            })
    }
)

const deleteGroup = declareAsyncAction<string>('groups.delete',
    (id, store) => {
        return GroupsApi.deleteGroup(id)
            .then(() => {
                Toasts.success('Группа успешно удалена')
                store.dispatch(groupListActions.removeGroup([id]))
            })
            .catch(() => {
                Toasts.error('При удалении группы произошла ошибка')
            })
    }
)

const groupsLoadingAtom = declareAtom('groups.loading', true, on => [
    on(getGroups, () => true),
    on(getGroups.done, () => false),
    on(getGroups.fail, () => false),
    on(createGroup, () => true),
    on(createGroup.done, () => false),
    on(createGroup.fail, () => false),
    on(editGroup, () => true),
    on(editGroup.done, () => false),
    on(editGroup.fail, () => false),
    on(deleteGroup, () => true),
    on(deleteGroup.done, () => false),
    on(deleteGroup.fail, () => false),
])

const groupsActions = {
    getGroups,
    createGroup,
    editGroup,
    deleteGroup,
}

export {
    groupsActions,
    groupsLoadingAtom,
}