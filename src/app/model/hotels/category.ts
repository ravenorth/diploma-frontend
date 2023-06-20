import { DeleteCategory_ApiPayload, UpdateCategory_ApiPayload } from "../../../api/apiData"
import { CategoryApi } from "../../../api/categoryApi"
import { Toasts } from "../../../common/toasts/toasts"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { hotelAtoms, hotelsActions } from "./hotels"

const createCategory = declareAsyncAction<UpdateCategory_ApiPayload>('category.create',
    ({hotelId, categoryData}, store) => {
        return CategoryApi.createCategory({hotelId, categoryData})
            .then(() => {
                Toasts.success('Категория успешно создана')
                store.dispatch(hotelsActions.setCurrHotelId(hotelId))
            })
            .catch(() => {
                Toasts.error('При создании категории произошла ошибка')
            })
    }
)

const editCategory = declareAsyncAction<UpdateCategory_ApiPayload>('category.edit',
    ({hotelId, categoryData}, store) => {
        return CategoryApi.editCategory({hotelId, categoryData})
            .then(() => {
                Toasts.success('Категория успешно изменена')
                store.dispatch(hotelsActions.setCurrHotelId(hotelId))
            })
            .catch(() => {
                Toasts.error('При изменении категории произошла ошибка')
            })
    }
)

const deleteCategory = declareAsyncAction<DeleteCategory_ApiPayload>('category.delete',
    (payload, store) => {
        return CategoryApi.deleteCategory(payload)
            .then(() => {
                Toasts.success('Категория успешно удалена')
                const hotelId = store.getState(hotelAtoms).currHotelAtom.id
                store.dispatch(hotelsActions.setCurrHotelId(hotelId))
            })
            .catch(() => {
                Toasts.error('При удалении категории произошла ошибка')
            })
    }
)

const categoryActions = {
    createCategory,
    editCategory,
    deleteCategory,
}

export {
    categoryActions
}