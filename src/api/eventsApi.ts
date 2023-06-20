import { HttpStatus } from "../core/http/HttpStatus"
import { tokenHandler } from "../core/localStorage/token"
import { remapDMYToString } from "../core/time/time"
import { EventData, EventFullData, JournalData, JournalStatistic } from "../app/model/events/eventData"
import { ApiEventData } from "./apiData"
import { apiUrls } from "./apiUrls"

function getEventData(id: string): Promise<ApiEventData> {
    return fetch(apiUrls.getEventData + id, {
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

function getEvents(): Promise<Array<EventData>> {
    return fetch(apiUrls.getAllEvents, {
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

function createEvent(eventData: Omit<EventFullData, 'id'>): Promise<{id: string}> {
    return fetch(apiUrls.createEvent, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...eventData,
            start: remapDMYToString(eventData.start),
            end: remapDMYToString(eventData.end),
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

function editEvent(eventData: EventFullData): Promise<Response> {
    return fetch(apiUrls.editEvent + eventData.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": tokenHandler.get(),
        },
        body: JSON.stringify({
            ...eventData,
            start: remapDMYToString(eventData.start),
            end: remapDMYToString(eventData.end),
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

function deleteEvent(id: string): Promise<Response> {
    return fetch(apiUrls.deleteEvent + id, {
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

function getJournalStatistic(id: string): Promise<JournalStatistic[]> {
    return fetch(apiUrls.getJournalStatistic + id, {
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

function getJournalData(id: string): Promise<JournalData[]> {
    return fetch(apiUrls.getJournalData + id, {
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

const EventsApi = {
    getEventData,
    getEvents,
    createEvent,
    editEvent,
    deleteEvent,
    getJournalStatistic,
    getJournalData,
}

export {
    EventsApi,
}