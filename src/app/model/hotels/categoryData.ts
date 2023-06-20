import { Dayjs } from "dayjs"
import { remapToSelectOption } from "../../../core/utils/option"
import { SelectOption } from "../../viewModel/viewData"
import { HotelBlockRowData } from "./hotelData"

type CategoryType = 0 | 1 | 2

const categoryTypeArr: Array<CategoryType> = [0, 1, 2]

const categoryTypeMap = {
    0: 'Эконом',
    1: 'Стандарт',
    2: 'Люкс',
}

function getCategoryTypeAsSelectOptions(): SelectOption[] {
    return categoryTypeArr.map(item => remapToSelectOption(item, categoryTypeMap[item]))
}

type CategoryData = {
    id: string,
    name: string,
}

type Slot = {
    date: Dayjs,
    amount: number,
}

type CategoryFullData = HotelBlockRowData

export type {
    CategoryType,
    CategoryData,
    Slot,
    CategoryFullData,
}

export {
    categoryTypeArr,
    categoryTypeMap,
    getCategoryTypeAsSelectOptions,
}