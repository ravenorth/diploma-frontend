import { declareMapAtom } from "../../../core/reatom/declareMapAtom"
import { UserFullData } from "./userData"

const {
    atom: userListAtom,
    updateItems: updateUsers,
    updateItem: updateUser,
    removeItems: removeUser,
    removeAllItems: clearUsers,
} = declareMapAtom<UserFullData>(
    'users',
    user => user.id,
)

const userListActions = {
    updateUsers,
    updateUser,
    removeUser,
    clearUsers,
}

export {
    userListActions,
    userListAtom,
}