import { CategoryFullData, CategoryType } from "../app/model/hotels/categoryData"
import { GroupFullData } from "../app/model/guests/groupData"
import { UserData, UserFullData } from "../app/model/users/userData"
import { GuestFullData } from "../app/model/guests/guestData"
import { HotelFullData, HotelInfoData } from "../app/model/hotels/hotelData"

type Login_ApiPayload = {
    email: string,
    password: string,
    rememberMe: boolean,
}

type UserFullData_ApiResponse = UserFullData & {
    token: string,
}

type CreateGuest_ApiPayload = {
    parentGroup: GroupFullData,
    guestData: Omit<GuestFullData, 'id'>,
}

type EditGuest_ApiPayload = {
    parentGroup: GroupFullData,
    guestData: GuestFullData,
}

type DeleteGuest_ApiPayload = {
    parentGroup: GroupFullData,
    guestId: string,
}

type CreateGroup_ApiPayload = {
    eventId: string,
    groupData: Omit<GroupFullData, 'id'|'guests'>,
}

type CreateHotel_ApiPayload = {
    eventId: string,
    hotelData: Omit<HotelInfoData, 'id'>,
}

type UpdateCategory_ApiPayload = {
    hotelId: string,
    categoryData: Omit<CategoryFullData, 'id'>,
}

type DeleteCategory_ApiPayload = {
    hotelId: string,
    categoryName: string,
}

type SettleGroup_ApiPayload = {
    groupId: string,
    hotelId: string,
    categoryName: string,
}

type ApiEventData = {
    id: string,
    name: string,
    dateOfStart: Date,
    dateOfEnd: Date,
}

type ApiGroupData = {
    id: string;
    name: string;
    preferredType: CategoryType;
    dateOfStart: Date;
    dateOfEnd: Date;
    status: boolean;
    manager?: UserData | undefined;
    settlers: GuestFullData[];
}

type ApiHotelData = HotelFullData & {
    checkin: string,
    checkout: string,
    name: string,
}

type ApiEditHotelData = HotelInfoData & {
    eventId: string,
}

export type {
    Login_ApiPayload,
    UserFullData_ApiResponse,
    CreateGuest_ApiPayload,
    EditGuest_ApiPayload,
    DeleteGuest_ApiPayload,
    CreateGroup_ApiPayload,
    CreateHotel_ApiPayload,
    UpdateCategory_ApiPayload,
    DeleteCategory_ApiPayload,
    SettleGroup_ApiPayload,
    ApiEventData,
    ApiGroupData,
    ApiHotelData,
    ApiEditHotelData,
}