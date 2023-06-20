import { Dayjs } from "dayjs"
import { UserData } from "../users/userData"
import { CategoryType } from "./categoryData"

type HotelData = {
    id: string,
    name: string,
}

type HotelGuestsRowData = {
    id: string,
    groupName: string,
    guestFullName: string,
    capacity: number,
    categoryName: string,
    checkIn: Dayjs,
    checkOut: Dayjs,
    dayNumber: number,
    price: number,
    total: number,
}

type HotelBlockRowData = {
    categoryName: string,
    categoryType: CategoryType,
    capacity: number,
    slots: number[],
    price: number,
}

type HotelInfoData = {
    id: string,
    name: string,
    checkin: Dayjs,
    checkout: Dayjs,
    cancelCondition: string,
    hotelUser?: UserData,
    managerUsers: UserData[],
    phone: string,
    email: string,
    link: string,
    address: string,
    stars: number,
}

type HotelFullData = HotelInfoData & {
    guestsData: HotelGuestsRowData[],
    hotelBlockData: HotelBlockRowData[],
    factBlockData: HotelBlockRowData[],
    difBlockData: HotelBlockRowData[],
}

export type {
    HotelData,
    HotelInfoData,
    HotelFullData,
    HotelGuestsRowData,
    HotelBlockRowData,
}