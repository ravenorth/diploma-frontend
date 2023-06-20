import { HotelData, HotelInfoData } from "../app/model/hotels/hotelData"
import { HttpStatus } from "../core/http/HttpStatus"
import { tokenHandler } from "../core/localStorage/token"
import { remapHMToString } from "../core/time/time"
import { ApiEditHotelData, ApiHotelData } from "./apiData"
import { apiUrls } from "./apiUrls"

function getHotelData(hotelId: string): Promise<ApiHotelData> {
    return fetch(apiUrls.getHotelData + hotelId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
    })
        .then(response => {
            switch (response.status) {
                case HttpStatus.OK:
                    return Promise.resolve(response.json())
                default:
                    return Promise.reject(response)
            }
        })
}

function getHotels(eventId: string): Promise<Array<HotelData>> {
    return fetch(apiUrls.getAllHotels + eventId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
    })
        .then(response => {
            switch (response.status) {
                case HttpStatus.OK:
                    return Promise.resolve(response.json())
                default:
                    return Promise.reject(response)
            }
        })
}

function createHotel(eventId: string, hotelData: Omit<HotelInfoData, 'id'>): Promise<{id: string}> {
    return fetch(apiUrls.createHotel, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...hotelData,
            hotelUserId: hotelData.hotelUser?.id || null,
            managerUsersId: hotelData.managerUsers.map(item => item.id),
            checkin: remapHMToString(hotelData.checkin),
            checkout: remapHMToString(hotelData.checkout),
            adress: hotelData.address,
            eventId,
        }),
    })
        .then(response => {
            switch (response.status) {
                case HttpStatus.OK:
                    return Promise.resolve(response.json())
                default:
                    return Promise.reject(response)
            }
        })
}

function editHotel(hotelData: ApiEditHotelData): Promise<Response> {
    return fetch(apiUrls.editHotel + hotelData.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...hotelData,
            hotelUserId: hotelData.hotelUser?.id || null,
            managerUsersId: hotelData.managerUsers.map(item => item.id),
            checkin: remapHMToString(hotelData.checkin),
            checkout: remapHMToString(hotelData.checkout),
            adress: hotelData.address,
        }),
    })
        .then(response => {
            switch (response.status) {
                case HttpStatus.OK:
                    return Promise.resolve(response)
                default:
                    return Promise.reject(response)
            }
        })
}

function deleteHotel(id: string): Promise<Response> {
    return fetch(apiUrls.deleteHotel + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
    })
        .then(response => {
            switch (response.status) {
                case HttpStatus.OK:
                    return Promise.resolve(response)
                default:
                    return Promise.reject(response)
            }
        })
}

const HotelsApi = {
    getHotelData,
    getHotels,
    createHotel,
    editHotel,
    deleteHotel,
}

export {
    HotelsApi,
}