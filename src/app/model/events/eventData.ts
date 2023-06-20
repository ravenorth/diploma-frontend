import { Dayjs } from "dayjs"

type Block = 0 | 1 | 2

const blockArr = [0, 1, 2]
const blockColors = ['green', 'gold', 'red']
const blockOptions = ['В ОТЕЛЕ', 'ФАКТИЧЕКИЙ', 'РАЗНИЦА']
const blockTitles = ['БЛОК В ОТЕЛЕ', 'ФАКТИЧЕСКИЙ БЛОК', 'РАЗНИЦА']

type JournalStatistic = {
    hotelName: string,
    categoryName: string,
    block: Block,
    capacity: number,
    slots: number[],
    price: number,
}

type JournalData = {
    hotelName: string,
    groupName: string,
    fullName: string, //!
    capacity: number,
    categoryName: string,
    checkin: Dayjs,
    checkout: Dayjs,
    slots: number,
    dayNumber: number,
    price: number,
    total: number,
}

type EventData = {
    id: string,
    name: string,
}

type EventFullData = {
    id: string,
    name: string,
    start: Dayjs,
    end: Dayjs,
}

export {
    blockArr,
    blockOptions,
    blockTitles,
    blockColors,
}

export type {
    Block,
    JournalStatistic,
    JournalData,
    EventData,
    EventFullData,
}