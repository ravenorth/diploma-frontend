import { HttpStatus } from "../core/http/HttpStatus"
import { tokenHandler } from "../core/localStorage/token"
import { DeleteCategory_ApiPayload, UpdateCategory_ApiPayload } from "./apiData"
import { apiUrls } from "./apiUrls"

function createCategory({hotelId, categoryData}: UpdateCategory_ApiPayload): Promise<Response> {
    return fetch(apiUrls.category, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...categoryData,
            hotelId,
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

function editCategory({hotelId, categoryData}: UpdateCategory_ApiPayload): Promise<Response> {
    return fetch(apiUrls.category, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...categoryData,
            hotelId,
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

function deleteCategory({hotelId, categoryName}: DeleteCategory_ApiPayload): Promise<Response> {
    return fetch(apiUrls.category, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            hotelId,
            name: categoryName,
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

const CategoryApi = {
    createCategory,
    editCategory,
    deleteCategory,
}

export {
    CategoryApi,
}