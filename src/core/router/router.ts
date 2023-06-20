import {History} from "history";
import { EventsLayout } from "../../app/view/main/layouts/events/EventsLayout";
import { HotelsLayout } from "../../app/view/main/layouts/hotels/HotelsLayout";
import { GuestsLayout } from "../../app/view/main/layouts/guests/GuestsLayout";
import { UsersLayout } from "../../app/view/main/layouts/users/UsersLayout";

const AUTH = '/auth'
const MAIN = '/main'
const EVENTS = '/events'
const HOTELS = '/hotels'
const GUESTS = '/guests'
const USERS = '/users'

let RouterHistory: History|null = null

function initRouterHistory(history: History) {
    RouterHistory = history
}

function replaceUrl(path: string, push: boolean = false) {
    if (!RouterHistory) {
        throw new Error('router not initialized')
    }
    push
        ? RouterHistory.push(path)
        : RouterHistory.replace(path)
}

function generateAuthUrl() {
    return `${AUTH}`
}
function openAuth(push: boolean = false) {
    replaceUrl(generateAuthUrl(), push)
}
function generateMainUrl() {
    return `${MAIN}`
}
function openMain(push: boolean = false) {
    replaceUrl(generateMainUrl(), push)
}
function generateEventsUrl() {
    return `${MAIN}${EVENTS}`
}
function openEvents(push: boolean = false) {
    replaceUrl(generateEventsUrl(), push)
}
function generateHotelsUrl() {
    return `${MAIN}${HOTELS}`
}
function openHotels(push: boolean = false) {
    replaceUrl(generateHotelsUrl(), push)
}
function generateGuestsUrl() {
    return `${MAIN}${GUESTS}`
}
function openGuests(push: boolean = false) {
    replaceUrl(generateGuestsUrl(), push)
}
function generateUsersUrl() {
    return `${MAIN}${USERS}`
}
function openUsers(push: boolean = false) {
    replaceUrl(generateUsersUrl(), push)
}

const Router = {
    Auth: {
        open: openAuth,
        url: generateAuthUrl,
    },
    Main: {
        open: openMain,
        url: generateMainUrl,
    },
    Events: {
        open: openEvents,
        url: generateEventsUrl,
    },
    Hotels: {
        open: openHotels,
        url: generateHotelsUrl,
    },
    Guests: {
        open: openGuests,
        url: generateGuestsUrl,
    },
    Users: {
        open: openUsers,
        url: generateUsersUrl,
    },
}

const adminRoutes = [
    {path: generateEventsUrl(), component: EventsLayout},
    {path: generateHotelsUrl(), component: HotelsLayout},
    {path: generateGuestsUrl(), component: GuestsLayout},
    {path: generateUsersUrl(), component: UsersLayout},
]

const managerRoutes = [
    {path: generateEventsUrl(), component: EventsLayout},
    {path: generateHotelsUrl(), component: HotelsLayout},
    {path: generateGuestsUrl(), component: GuestsLayout},
]

const hotelRoutes = [
    {path: generateHotelsUrl(), component: HotelsLayout},
]

export {
    initRouterHistory,

    Router,
    adminRoutes,
    managerRoutes,
    hotelRoutes,
}