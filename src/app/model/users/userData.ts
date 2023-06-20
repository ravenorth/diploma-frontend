import { UserRole } from "./userRole"

type UserData = {
    id: string,
    fullName: string,
}

type UserFullData = {
    id: string,
    role: UserRole,
    fullName: string,
    email: string,
}

export type {
    UserData,
    UserFullData,
}