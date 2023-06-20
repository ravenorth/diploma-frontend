import { declareMapAtom } from "../../../core/reatom/declareMapAtom"
import { GroupFullData } from "./groupData"

const {
    atom: groupListAtom,
    updateItems: updateGroups,
    updateItem: updateGroup,
    removeItems: removeGroup,
    removeAllItems: clearGroups,
} = declareMapAtom<GroupFullData>(
    'groups',
    group => group.id,
)

const groupListActions = {
    updateGroups,
    updateGroup,
    removeGroup,
    clearGroups,
}

export {
    groupListActions,
    groupListAtom,
}