import { combine, declareAction, declareAtom, map } from "@reatom/core"
import { GroupFullData, SettleOption } from "../../model/guests/groupData"
import { settleActions } from "../../model/guests/settle"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { SettlementApi } from "../../../api/settlementApi"
import { Toasts } from "../../../common/toasts/toasts"
import { getItemById } from "../../../core/utils/array"

type SettleOptionsFilter = 'all'|'preferred'

const filterOptions = [
    { value: 'preferred', label: 'Предпочитаемые категории номеров' },
    { value: 'all', label: 'Все варианты' },
]

const open = declareAction<GroupFullData>('settleGroup.open')
const close = declareAction('settleGroup.close')

const openedAtom = declareAtom('settleGroup.opened', false, on => [
    on(open, () => true),
    on(close, () => false),
    on(settleActions.settleGroup.done, () => false),
])

const [groupAtom, setGroup] = declareAtomWithSetter('settleGroup.group', {} as GroupFullData, on => [
    on(open, (_, value) => value),
])

const [optionsAtom, setOptions] = declareAtomWithSetter<SettleOption[]>('settleGroup.options', [], on => [
    on(close, () => []),
])

const [filterAtom, setFilter] = declareAtomWithSetter<SettleOptionsFilter>('settleGroup.filter', 'preferred', on => [
    on(open, () => 'preferred'),
])

const filteredOptionsAtom = map<SettleOption[], any>(
    combine({filterAtom, optionsAtom, groupAtom}),
    ({filterAtom, optionsAtom, groupAtom}) => filterAtom === 'preferred'
        ? optionsAtom.filter((item: SettleOption) => item.categoryType === groupAtom.preferredCategory)
        : optionsAtom
) 

const [checkedOptionAtom, setCheckedOption] = declareAtomWithSetter<string|null>('settleGroup.checkedOption', null, on => [
    on(open, () => null),
    on(setFilter, () => null),
])

const getSettleOptions = declareAsyncAction<string>('settleGroup.getSettleOptions',
    (groupId, store) => {
        return SettlementApi.getSettleOptions(groupId)
            .then(options => {
                store.dispatch(setOptions(options.map(item => ({
                    ...item,
                    id: item.hotelId + item.categoryName,
                }))))
            })
            .catch(() => {
                Toasts.error('При получении вариантов размещения произошла ошибка')
            })
    }
)

const loadingAtom = declareAtom<boolean>('settleGroup.loading', false, on => [
    on(getSettleOptions, () => true),
    on(getSettleOptions.done, () => false),
    on(getSettleOptions.fail, () => false),
    on(close, () => false),
])

const submitLoadingAtom = declareAtom<boolean>('settleGroup.loading', false, on => [
    on(settleActions.settleGroup, () => true),
    on(settleActions.settleGroup.done, () => false),
    on(settleActions.settleGroup.fail, () => false),
    on(close, () => false),
])

const submit = declareAction('settleGroup.submit',
    (_, store) => {
        const group = store.getState(groupAtom)
        const options = store.getState(optionsAtom)
        const checkedOptionId = store.getState(checkedOptionAtom)

        let checkedOption
        if (checkedOptionId) {
            checkedOption = getItemById(options, checkedOptionId) as SettleOption
        }
        else {
            Toasts.warning('Выберите вариант')
            return
        }

        store.dispatch(settleActions.settleGroup({
            group,
            hotelId: checkedOption.hotelId,
            categoryName: checkedOption.categoryName,
        }))
    }
)

const settleGroupPopupAtoms = combine({
    openedAtom,
    loadingAtom,
    groupAtom,
    optionsAtom,
    filterAtom,
    filteredOptionsAtom,
    checkedOptionAtom,
    submitLoadingAtom,
})

const settleGroupPopupActions = {
    open,
    close,
    submit,
    setGroup,
    setFilter,
    setCheckedOption,
    getSettleOptions,
}

export {
    settleGroupPopupAtoms,
    settleGroupPopupActions,
    filterOptions,
}

export type {
    SettleOptionsFilter,
}