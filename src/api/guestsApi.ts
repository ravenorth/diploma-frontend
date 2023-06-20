import { GuestFullData } from "../app/model/guests/guestData";
import { HttpStatus } from "../core/http/HttpStatus";
import { tokenHandler } from "../core/localStorage/token";
import { apiUrls } from "./apiUrls";

function createGuest(groupId: string, guestData: Omit<GuestFullData, 'id'>): Promise<{id: string}> {
    return fetch(apiUrls.guest, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...guestData,
            groupId,
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

function editGuest(guestData: GuestFullData): Promise<Response> {
    return fetch(apiUrls.guest + guestData.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...guestData,
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

function deleteGuest(id: string): Promise<Response> {
    return fetch(apiUrls.guest + id, {
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

const GuestsApi = {
    createGuest,
    editGuest,
    deleteGuest,
}

export {
    GuestsApi,
}