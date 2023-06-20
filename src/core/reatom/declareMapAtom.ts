import {DependencyMatcher} from "./reatomTypes";
import {declareAction, declareAtom} from "@reatom/core";

type MapItems<T> = {
    [item: string]: T,
}

function declareMapAtom<T>(
    name: string,
    getItemKey: (item: T) => string,
    dependencyMatcher?: DependencyMatcher<MapItems<T>>,
    initialState?: T[]
) {

    const updateItem = declareAction<T>()
    const removeItems = declareAction<Array<string>>()
    const updateItems = declareAction<Array<T>>()
    const setNewItems = declareAction<Array<T>>()
    const removeAllItems = declareAction()

    const initialMap: MapItems<T> = {}
    initialState && initialState.forEach(item => {
        initialMap[getItemKey(item)] = item
    })

    return {
        atom: declareAtom<MapItems<T>>(name, initialMap, on => [
            on(updateItems, (state, items) => {
                const itemsMap: MapItems<T> = {...state}
                items.forEach(item => itemsMap[getItemKey(item)] = item)
                return itemsMap
            }),
            on(updateItem, (state, item) => ({
                ...state,
                [getItemKey(item)]: item,
            })),
            on(removeItems, (state, itemIds) => {
                const newItems = {
                    ...state,
                }
                itemIds.forEach(itemId => {
                    delete newItems[itemId]
                })
                return newItems
            }),
            on(setNewItems, (_, items) => {
                const newItems: MapItems<T> = {}
                items.forEach(item => {
                    newItems[getItemKey(item)] = item
                })
                return newItems
            }),
            on(removeAllItems, () => {
                const emptyItems: MapItems<T> = {}
                return emptyItems
            }),
            dependencyMatcher && dependencyMatcher(on)
        ]),
        updateItem,
        removeItems,
        updateItems,
        setNewItems,
        removeAllItems
    }
}

export type {
    MapItems,
}

export {
    declareMapAtom,
}