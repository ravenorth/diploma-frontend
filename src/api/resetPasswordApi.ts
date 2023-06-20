import { HttpStatus } from "../core/http/HttpStatus"
import { apiUrls } from "./apiUrls"

function sendCode(email: string): Promise<Response> {
    return fetch(apiUrls.sendCode, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
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

function verifyCode(email: string, code: string): Promise<Response> {
    return fetch(apiUrls.verifyCode, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            code: code,
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

function resetPassword(email: string, password: string): Promise<Response> {
    return fetch(apiUrls.resetPassword, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            newPassword: password,
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

const ResetPasswordApi = {
    sendCode,
    verifyCode,
    resetPassword,
}

export {
    ResetPasswordApi,
}