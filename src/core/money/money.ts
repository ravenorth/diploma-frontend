function numberToStringMoney(value: number) {
    let str = value.toString()
    while (str.length < 3) {
        str = '0' + str
    }
    return str.slice(0, -2) + '.' + str.slice(-2)
}

export {
    numberToStringMoney
}