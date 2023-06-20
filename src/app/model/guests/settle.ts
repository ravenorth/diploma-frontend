import { SettlementApi } from "../../../api/settlementApi"
import { Toasts } from "../../../common/toasts/toasts"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { getItemById } from "../../../core/utils/array"
import { GroupFullData } from "./groupData"
import { groupListActions, groupListAtom } from "./groupList"

type SettleGroupPayload = {
    group: GroupFullData,
    hotelId: string,
    categoryName: string,
}

const settleGroup = declareAsyncAction<SettleGroupPayload>('settle.settle',
    ({group, hotelId, categoryName}, store) => {
        return SettlementApi.settleGroup({groupId: group.id, hotelId, categoryName})
            .then(() => {
                store.dispatch(groupListActions.updateGroup({
                    ...group,
                    status: true,
                }))
                Toasts.success('Группа успешно размещена')
            })
            .catch(() => {
                Toasts.error('При размещении группы произошла ошибка')
            })
    }
)

const deleteSettlement = declareAsyncAction<string>('settle.delete',
    (groupId, store) => {
        return SettlementApi.deleteSettlement(groupId)
            .then(() => {
                const groupList = store.getState(groupListAtom)
                const group = getItemById(Object.values(groupList), groupId)
                store.dispatch(groupListActions.updateGroup({
                    ...group,
                    status: false,
                }))
                Toasts.success('Размещение группы успешно удалено')
            })
            .catch(() => {
                Toasts.error('При удалении размещения группы произошла ошибка')
            })
    }
)

const settleActions = {
    settleGroup,
    deleteSettlement,
}

export {
    settleActions,
}