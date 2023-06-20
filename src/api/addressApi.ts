import { HttpStatus } from "../core/http/HttpStatus"

const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address"
const token = "1bcc881a8b9e3f6b676ffac291e7ced1028db81d"

function getAddressOptions(query: string): Promise<any> {
    return fetch(url, {
        method: 'POST',
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify({query})
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

export {
    getAddressOptions,
}