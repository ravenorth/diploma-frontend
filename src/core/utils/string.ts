function clearExtraSpaces(str: string): string {
    return str.trim().replace(/\s+/g,' ')
}

function compareStringValues(a: string, b: string) {
    if ([a, b].sort()[0] === a) {
        return -1
    }
    else {
        return 1
    }
}

export {
    clearExtraSpaces,
    compareStringValues,
}