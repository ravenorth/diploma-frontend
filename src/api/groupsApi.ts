import { HttpStatus } from "../core/http/HttpStatus"
import { tokenHandler } from "../core/localStorage/token"
import { remapDMYToString } from "../core/time/time"
import { GroupFullData } from "../app/model/guests/groupData"
import { ApiGroupData } from "./apiData"
import { apiUrls } from "./apiUrls"

function getGroups(eventId: string): Promise<Array<ApiGroupData>> {
    return fetch(apiUrls.groupsList + eventId, {
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

function createGroup(eventId: string, groupData: Omit<GroupFullData, 'id'|'guests'|'status'>): Promise<{id: string}> {
    return fetch(apiUrls.group, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...groupData,
            preferredCategoryType: groupData.preferredCategory,
            checkin: remapDMYToString(groupData.checkin),
            checkout: remapDMYToString(groupData.checkout),
            managerId: groupData.manager?.id || null,
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

function editGroup(groupData: Omit<GroupFullData, 'guests'|'status'>): Promise<Response> {
    return fetch(apiUrls.group + groupData.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...groupData,
            preferredCategoryType: groupData.preferredCategory,
            checkin: remapDMYToString(groupData.checkin),
            checkout: remapDMYToString(groupData.checkout),
            managerId: groupData.manager?.id || null,
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

function deleteGroup(id: string): Promise<Response> {
    return fetch(apiUrls.group + id, {
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

const GroupsApi = {
    getGroups,
    createGroup,
    editGroup,
    deleteGroup,
}

export {
    GroupsApi,
}