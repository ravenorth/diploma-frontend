const TAG = 'authenticationToken'

function remove(): void {
    localStorage.removeItem(TAG)
}

function get(): string {
    return JSON.parse(localStorage.getItem(TAG) || '')
}

function set(token: string): void {
    localStorage.setItem(TAG, JSON.stringify(token));
}

export const tokenHandler = {
    remove,
    set,
    get,
}