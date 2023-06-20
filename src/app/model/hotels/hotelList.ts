import { declareMapAtom } from "../../../core/reatom/declareMapAtom"
import { HotelData } from "./hotelData"

const {
    atom: hotelListAtom,
    updateItems: updateHotels,
    updateItem: updateHotel,
    removeItems: removeHotel,
    removeAllItems: clearHotels,
} = declareMapAtom<HotelData>(
    'hotels',
    hotel => hotel.id,
)

const hotelListActions = {
    updateHotels,
    updateHotel,
    removeHotel,
    clearHotels,
}

export {
    hotelListActions,
    hotelListAtom,
}