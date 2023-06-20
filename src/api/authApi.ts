import { HttpStatus } from "../core/http/HttpStatus"
import { apiUrls } from "./apiUrls"
import { Login_ApiPayload, UserFullData_ApiResponse } from "./apiData"
import { tokenHandler } from "../core/localStorage/token"

async function logIn(data: Login_ApiPayload): Promise<UserFullData_ApiResponse> {
    return fetch(apiUrls.login, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: data.email,
            password: data.password,
            rememberMe: data.rememberMe,
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

async function logOut(): Promise<Response> {
    return fetch(apiUrls.logout, {
        method: 'GET',
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

const AuthApi = {
    logIn,
    logOut,
}

export {
    AuthApi,
}