import { declareMapAtom } from "../../../core/reatom/declareMapAtom"
import { EventData } from "./eventData"

const {
    atom: eventListAtom,
    updateItems: updateEvents,
    updateItem: updateEvent,
    removeItems: removeEvent,
    removeAllItems: clearEvents,
} = declareMapAtom<EventData>(
    'events',
    event => event.id,
)

const eventListActions = {
    updateEvents,
    updateEvent,
    removeEvent,
    clearEvents,
}

export {
    eventListActions,
    eventListAtom,
}