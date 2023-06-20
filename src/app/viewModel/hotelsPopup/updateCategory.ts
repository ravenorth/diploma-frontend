import { combine, declareAction, declareAtom } from "@reatom/core"
import { CategoryFullData, CategoryType } from "../../model/hotels/categoryData"
import { categoryActions } from "../../model/hotels/category"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { hotelAtoms } from "../../model/hotels/hotels"
import { validateNotEmptyValue } from "../../../core/validator/validator"

type ModeType = 'create' | 'edit'

type OpenPayload = {
    mode: 'create',
} | {
    mode: 'edit',
    data: CategoryFullData,
}

const open = declareAction<OpenPayload>('updateCategoryPopup.open')
const close = declareAction('updateCategoryPopup.close')

const openedAtom = declareAtom('updateCategoryPopup.opened', false, on => [
    on(open, () => true),
    on(close, () => false),
    on(categoryActions.createCategory.done, () => false),
    on(categoryActions.editCategory.done, () => false),
])

const popupModeAtom = declareAtom<ModeType>('updateCategoryPopup.popupMode', 'edit', on => [
    on(open, (_, value) => value.mode)
])

const [nameAtom, setName] = declareAtomWithSetter<string>('updateCategoryPopup.name', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.categoryName : ''),
])

const [typeAtom, setType] = declareAtomWithSetter<CategoryType>('updateCategoryPopup.type', 1, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.categoryType : 1),
])

const [capacityAtom, setCapacity] = declareAtomWithSetter<number>('updateCategoryPopup.capacity', 0, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.capacity : 0),
])

const [priceAtom, setPrice] = declareAtomWithSetter<number>('updateCategoryPopup.price', 0, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.price : 0),
])

const [slotsAtom, setSlots] = declareAtomWithSetter<number[]>('updateCategoryPopup.slots', [], on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.slots : []),
])

const [nameErrorAtom, setNameError] = declareAtomWithSetter<string>('updateCategoryPopup.nameError', '', on => [
    on(setName, () => ''),
    on(open, () => '')
])

const loadingAtom = declareAtom<boolean>('updateCategoryPopup.loading', false, on => [
    on(categoryActions.createCategory, () => true),
    on(categoryActions.createCategory.done, () => false),
    on(categoryActions.createCategory.fail, () => false),
    on(categoryActions.editCategory, () => true),
    on(categoryActions.editCategory.done, () => false),
    on(categoryActions.editCategory.fail, () => false),
    on(close, () => false),
])

const submit = declareAction('updateCategoryPopup.submit',
    (_, store) => {
        const popupMode = store.getState(popupModeAtom)
        const hotelId = store.getState(hotelAtoms).currHotelAtom.id
        const categoryName = store.getState(nameAtom)
        const categoryType = store.getState(typeAtom)
        const capacity = store.getState(capacityAtom)
        const slots = store.getState(slotsAtom)
        const price = store.getState(priceAtom)

        const nameError = validateNotEmptyValue(categoryName)

        if (nameError) {
            store.dispatch(setNameError(nameError))
            return
        }

        if (popupMode === 'create') {
            store.dispatch(categoryActions.createCategory({
                hotelId,
                categoryData: {
                    categoryName,
                    categoryType,
                    capacity,
                    slots,
                    price,
                }
            }))
        }
        else {
            store.dispatch(categoryActions.editCategory({
                hotelId,
                categoryData: {
                    categoryName,
                    categoryType,
                    capacity,
                    slots,
                    price,
                }
            }))
        }
    }
)

const updateCategoryPopupAtoms = combine({
    popupModeAtom,
    openedAtom,
    nameAtom,
    typeAtom,
    priceAtom,
    capacityAtom,
    slotsAtom,
    nameErrorAtom,
    loadingAtom,
})

const updateCategoryPopupActions = {
    open,
    close,
    setName,
    setType,
    setCapacity,
    setPrice,
    setSlots,
    setNameError,
    submit,
}

export {
    updateCategoryPopupAtoms,
    updateCategoryPopupActions,
}