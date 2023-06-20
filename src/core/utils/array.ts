function getItemById(arr: any[], id: string): any {
    const res = arr.find(item => item.id === id)
    return {...res}
}

function replaceItemById(arr: any[], id: string, newItem: any): any[] {
    const res = arr.map(item => {
        if (item.id === id) {
            return {...newItem}
        }
        return item
    })
    return [...res]
}

function removeItemById(arr: any[], id: string): any[] {
    const res = arr.filter(item => item.id !== id)
    return [...res]
}

export {
    getItemById,
    replaceItemById,
    removeItemById,
}