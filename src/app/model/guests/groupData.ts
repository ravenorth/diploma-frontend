import { Dayjs } from "dayjs"
import { GuestFullData } from "./guestData"
import { UserData } from "../users/userData"
import { CategoryType } from "../hotels/categoryData"

type GroupData = {
    id: string,
    name: string,
}

type GroupFullData = {
    id: string,
    name: string,
    preferredCategory: CategoryType,
    checkin: Dayjs,
    checkout: Dayjs,
    status: boolean,
    manager?: UserData,
    guests: GuestFullData[],
}

type SettleOption = {
    id: string,
    hotelId: string,
    hotelName: string,
    categoryName: string,
    categoryType: CategoryType,
}

function getGroupNameById(list: Array<GroupData>, id: string): string {
    const temp = list.find(item => item.id === id)
    return temp?.name || ''
}

export type {
    GroupData,
    GroupFullData,
    SettleOption,
}

export {
    getGroupNameById,
}