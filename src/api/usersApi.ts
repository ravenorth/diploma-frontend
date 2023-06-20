import { HttpStatus } from "../core/http/HttpStatus";
import { tokenHandler } from "../core/localStorage/token";
import { UserData, UserFullData } from "../app/model/users/userData"
import { apiUrls } from "./apiUrls";
import { remapRoleToApi } from "../app/model/users/userRole";

function getManagers(): Promise<Array<UserData>> {
    return fetch(apiUrls.managersList, {
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

function getAllHotelUsers(): Promise<Array<UserData>> {
    return fetch(apiUrls.hotelUsersList, {
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

function getUsers(): Promise<Array<UserFullData>> {
    return fetch(apiUrls.usersList, {
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

function createUser(userData: Omit<UserFullData, 'id'>): Promise<{id: string}> {
    return fetch(apiUrls.user, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...userData,
            role: remapRoleToApi(userData.role),
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

function editUser(userData: UserFullData): Promise<Response> {
    return fetch(apiUrls.user + userData.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...userData,
            role: remapRoleToApi(userData.role)
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

function deleteUser(id: string): Promise<Response> {
    return fetch(apiUrls.user + id, {
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

const UsersApi = {
    getManagers,
    getAllHotelUsers,
    getUsers,
    createUser,
    editUser,
    deleteUser,
}

export {
    UsersApi,
}