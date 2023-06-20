import { HttpStatus } from "../core/http/HttpStatus";
import { tokenHandler } from "../core/localStorage/token";
import { UserData, UserFullData } from "../app/model/users/userData"
import { apiUrls } from "./apiUrls";
import { remapRoleToApi } from "../app/model/users/userRole";

function getManagers(): Promise<Array<UserData>> {
    return fetch(apiUrls.getAllManagers, {
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
    return fetch(apiUrls.getAllHotelUsers, {
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
    return fetch(apiUrls.getAllUsers, {
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
    return fetch(apiUrls.createUser, {
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
    return fetch(apiUrls.editUser + userData.id, {
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
    return fetch(apiUrls.deleteUser + id, {
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