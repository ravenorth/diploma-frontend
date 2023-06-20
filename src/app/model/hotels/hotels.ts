import { combine, declareAction, declareAtom } from "@reatom/core"
import { hotelListActions } from "./hotelList"
import dayjs from "dayjs"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { HotelFullData } from "./hotelData"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { HotelsApi } from "../../../api/hotelsApi"
import { remapStringToHM } from "../../../core/time/time"
import { Toasts } from "../../../common/toasts/toasts"
import { ApiEditHotelData, CreateHotel_ApiPayload } from "../../../api/apiData"
import { eventsAtoms } from "../events/events"

const [currHotelAtom, setCurrHotel] = declareAtomWithSetter<HotelFullData>('hotels.currHotel', {} as HotelFullData)

const getHotelData = declareAsyncAction<string>('hotels.getHotelData',
    (hotelId, store) => {
        return HotelsApi.getHotelData(hotelId)
            .then(hotelData => {
                store.dispatch(setCurrHotel({
                    ...hotelData,
                    id: hotelId,
                    checkin: remapStringToHM(hotelData.checkin),
                    checkout: remapStringToHM(hotelData.checkout),
                    guestsData: hotelData.guestsData.map(item => ({
                        ...item,
                        checkIn: dayjs(item.checkIn),
                        checkOut: dayjs(item.checkOut),
                    })),
                }))
            })
            .catch(() => {
                Toasts.error('При получении данных о гостинице произошла ошибка')
            })
    }
)

const setCurrHotelId = declareAction<string>('hotels.currHotel', 
    (hotelId, store) => {
        store.dispatch(getHotelData(hotelId))
    }
)

const getHotels = declareAsyncAction<string>('hotels.getHotels',
    (eventId, store) => {
        return HotelsApi.getHotels(eventId)
            .then(hotels => {
                store.dispatch(hotelListActions.clearHotels())
                if (hotels.length) {
                    store.dispatch(hotelListActions.updateHotels(hotels))
                    store.dispatch(setCurrHotelId(hotels[0].id))
                }
                else {
                    store.dispatch(hotelListActions.updateHotels([]))
                }
            })
            .catch(() => {
                Toasts.error('При получении списка гостиниц произошла ошибка')
            })
    }
)

const createHotel = declareAsyncAction<CreateHotel_ApiPayload>('hotels.create',
    ({eventId, hotelData}, store) => {
        return HotelsApi.createHotel(eventId, hotelData)
            .then(({id}) => {
                Toasts.success('Гостиница успешно создана')
                store.dispatch(hotelListActions.updateHotel({
                    id,
                    name: hotelData.name,
                }))
                store.dispatch(setCurrHotelId(id))
            })
            .catch(() => {
                Toasts.error('При создании гостиницы произошла ошибка')
            })
    }
)

const editHotel = declareAsyncAction<ApiEditHotelData>('hotels.edit',
    (hotelData, store) => {
        return HotelsApi.editHotel(hotelData)
            .then(() => {
                const currData = store.getState(currHotelAtom)
                store.dispatch(hotelListActions.updateHotel(hotelData))
                store.dispatch(setCurrHotel({
                    ...hotelData,
                    guestsData: currData.guestsData,
                    hotelBlockData: currData.hotelBlockData,
                    factBlockData: currData.factBlockData,
                    difBlockData: currData.difBlockData,
                }))
                Toasts.success('Гостиница успешно изменена')
            })
            .catch(() => {
                Toasts.error('При изменении гостиницы произошла ошибка')
            })
    }
)

const deleteHotels = declareAsyncAction<string>('hotels.delete',
    (id, store) => {
        return HotelsApi.deleteHotel(id)
            .then(() => {
                const currEventId = store.getState(eventsAtoms).currEventIdAtom 
                Toasts.success('Гостиница успешно удалена')
                store.dispatch(hotelListActions.removeHotel([id]))
                store.dispatch(getHotels(currEventId))
            })
            .catch(() => {
                Toasts.error('При удалении гостиницы произошла ошибка')
            })
    }
)

const currHotelLoadingAtom = declareAtom('hotels.currLoading', true, on => [
    on(getHotelData, () => true),
    on(getHotelData.done, () => false),
    on(getHotelData.fail, () => false),
    on(getHotels, () => true),
    on(getHotels.done, () => false),
    on(getHotels.fail, () => false),
])

const hotelsLoadingAtom = declareAtom('hotels.loading', true, on => [
    on(getHotels, () => true),
    on(getHotels.done, () => false),
    on(getHotels.fail, () => false),
    on(createHotel, () => true),
    on(createHotel.done, () => false),
    on(createHotel.fail, () => false),
    on(editHotel, () => true),
    on(editHotel.done, () => false),
    on(editHotel.fail, () => false),
    on(deleteHotels, () => true),
    on(deleteHotels.done, () => false),
    on(deleteHotels.fail, () => false),
])

const hotelAtoms = combine({
    currHotelAtom,
    hotelsLoadingAtom,
    currHotelLoadingAtom,
})

const hotelsActions = {
    setCurrHotelId,
    setCurrHotel,
    getHotelData,
    getHotels,
    createHotel,
    editHotel,
    deleteHotels,
}

export {
    hotelAtoms,
    hotelsActions,
}