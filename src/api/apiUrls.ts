const baseUrl = 'http://qwdsjenwfwasdq.site/'
// const baseUrl = 'https://80.78.248.73:443/'
// const baseUrl = 'https://localhost:7240/'

const apiUrl = baseUrl + 'api/'

const apiUrls = {
    login: apiUrl + 'login',
    logout: apiUrl + 'logout',

    sendCode: apiUrl + 'send_code',
    verifyCode: apiUrl + 'verify_code',
    resetPassword: apiUrl + 'reset_pass',

    initUser: apiUrl + 'user',
    updatePassword: apiUrl + 'upd_pass',

    getAllManagers: apiUrl + 'managers',
    getAllHotelUsers: apiUrl + 'hotel_users',
    getAllUsers: apiUrl + 'users',
    createUser: apiUrl + 'user',
    editUser: apiUrl + 'user/',
    deleteUser: apiUrl + 'user/',

    getAllGroups: apiUrl + 'groups/',
    createGroup: apiUrl + 'group',
    editGroup: apiUrl + 'group/',
    deleteGroup: apiUrl + 'group/',

    createGuest: apiUrl + 'settler',
    editGuest: apiUrl + 'settler/',
    deleteGuest: apiUrl + 'settler/',

    getSettleOptions: apiUrl + 'relev_hotels/',
    settleGroup: apiUrl + 'record',
    deleteSettlement: apiUrl + 'record/',

    getAllHotels: apiUrl + 'hotels/',
    getHotelData: apiUrl + 'hotel/',
    createHotel: apiUrl + 'hotel',
    editHotel: apiUrl + 'hotel/',
    deleteHotel: apiUrl + 'hotel/',
    createCatgory: apiUrl + 'days',
    editCategory: apiUrl + 'days',
    deleteCategory: apiUrl + 'days',

    getAllEvents: apiUrl + 'events',
    getEventData: apiUrl + 'event/',
    getJournalStatistic: apiUrl + 'get_journal_statistic/',
    getJournalData: apiUrl + 'record/',
    createEvent: apiUrl + 'event',
    editEvent: apiUrl + 'event/',
    deleteEvent: apiUrl + 'event/',
}

export {
    apiUrls,
}