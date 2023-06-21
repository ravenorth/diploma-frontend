const baseUrl = 'http://qwdsjenwfwasdq.site/'
// const baseUrl = '/'

const apiUrl = baseUrl + 'api/'

const apiUrls = {
    login: apiUrl + 'login/',
    logout: apiUrl + 'logout/',

    sendCode: apiUrl + 'send_code/',
    verifyCode: apiUrl + 'verify_code/',
    resetPassword: apiUrl + 'reset_pass/',

    updatePassword: apiUrl + 'upd_pass/',
    user: apiUrl + 'user/',
    usersList: apiUrl + 'users/',
    managersList: apiUrl + 'managers/',
    hotelUsersList: apiUrl + 'hotel_users/',

    group: apiUrl + 'group/',
    groupsList: apiUrl + 'groups/',

    guest: apiUrl + 'settler/',

    settleOptions: apiUrl + 'relev_hotels/',
    settlement: apiUrl + 'record/',

    hotel: apiUrl + 'hotel/',
    hotelsList: apiUrl + 'hotels/',
    category: apiUrl + 'days/',

    event: apiUrl + 'event/',
    eventsList: apiUrl + 'events/',
    statistics: apiUrl + 'journal_statistic/',
}

export {
    apiUrls,
}