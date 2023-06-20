import { HttpStatus } from "../core/http/HttpStatus"
import { tokenHandler } from "../core/localStorage/token"
import { UserFullData } from "../app/model/users/userData"
import { apiUrls } from "./apiUrls"

async function initUser(): Promise<UserFullData> {
    return fetch(apiUrls.initUser, {
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

function updatePassword(oldPassword: string, newPassword: string): Promise<Response> {
    return fetch(apiUrls.updatePassword, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            oldPassword,
            newPassword,
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

const CurrUserApi = {
    initUser,
    updatePassword,
}

export {
    CurrUserApi,
}