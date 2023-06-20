import dayjs, { Dayjs } from "dayjs";

function compareDateValues(a: Dayjs, b: Dayjs) {
    if (a.diff(b) >= 0) {
        return -1
    }
    else {
        return 1
    }
}

const HM_TIME_FORMAT = 'HH:mm'
const DM_TIME_FORMAT = 'DD.MM'
const DMY_TIME_FORMAT = 'DD.MM.YYYY'

function remapStringToHM(value: string): Dayjs {
    return dayjs(value, HM_TIME_FORMAT)
}

function remapStringToDMY(value: string): Dayjs {
    return dayjs(value, DMY_TIME_FORMAT)
}

function remapHMToString(time?: Dayjs): string {
    return time?.format(HM_TIME_FORMAT).toString() || '-'
}

function remapDMToString(time?: Dayjs): string {
    return time?.format(DM_TIME_FORMAT).toString() || '-'
}

function remapDMYToString(time?: Dayjs): string {
    return time?.format(DMY_TIME_FORMAT).toString() || '-'
}

function remapApiDate(value: any): Dayjs {
    return dayjs(value, 'YYYY-MM-DD')
}

function getStringDateArr(start: Dayjs, end: Dayjs): string[] {
    let dateArr = []
    let curr = start
    while (curr <= end) {
        dateArr.push(remapDMToString(curr))
        curr = curr.add(1, 'day')
    }
    return dateArr
}

function getDateArr(start: Dayjs, end: Dayjs): Dayjs[] {
    let dateArr = []
    let curr = start
    while (curr <= end) {
        dateArr.push(curr)
        curr = curr.add(1, 'day')
    }
    return dateArr
}

export {
    compareDateValues,
    remapStringToHM,
    remapStringToDMY,
    remapHMToString,
    remapDMToString,
    remapDMYToString,
    remapApiDate,
    HM_TIME_FORMAT,
    DM_TIME_FORMAT,
    DMY_TIME_FORMAT,
    getDateArr,
    getStringDateArr,
}