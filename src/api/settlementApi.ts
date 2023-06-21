import { HttpStatus } from "../core/http/HttpStatus";
import { tokenHandler } from "../core/localStorage/token";
import { SettleOption } from "../app/model/guests/groupData";
import { SettleGroup_ApiPayload } from "./apiData";
import { apiUrls } from "./apiUrls";

function getSettleOptions(id: string): Promise<SettleOption[]> {
    return fetch(apiUrls.settleOptions + id, {
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

function settleGroup(payload: SettleGroup_ApiPayload): Promise<Response> {
    return fetch(apiUrls.settlement, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...payload,
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

function deleteSettlement(groupId: string): Promise<Response> {
    return fetch(apiUrls.settlement + groupId, {
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

const SettlementApi = {
    getSettleOptions,
    settleGroup,
    deleteSettlement,
}

export {
    SettlementApi,
}