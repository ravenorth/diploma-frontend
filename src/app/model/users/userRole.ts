import { remapToSelectOption } from "../../../core/utils/option"
import { SelectOption } from "../../viewModel/viewData"

type UserRole = 'admin' | 'manager' | 'senior manager' | 'hotel'

const userRoleArr: Array<UserRole> = ['admin', 'manager', 'senior manager', 'hotel']

const userRoleTranslation = {
    'admin': 'Администратор',
    'manager': 'Менеджер',
    'senior manager': 'Старший менеджер',
    'hotel': 'Представитель отеля',
}

function remapApiRole(role: string): UserRole {
    switch (role) {
        case 'admin':
            return 'admin'
        case 'manager':
            return 'manager'
        case 'senior manager':
            return 'senior manager'
        default:
            return 'hotel'
    }
}

function remapRoleToApi(role: UserRole): string {
    switch (role) {
        case 'admin':
            return 'admin'
        case 'manager':
            return 'manager'
        case 'senior manager':
            return 'senior manager'
        default:
            return 'hotel'
    }
}

function getRoleAsSelectOptions(): SelectOption[] {
    return userRoleArr.map(item => remapToSelectOption(item, userRoleTranslation[item]))
}

export type {
    UserRole,
}

export {
    userRoleArr,
    userRoleTranslation,
    remapApiRole,
    remapRoleToApi,
    getRoleAsSelectOptions,
}