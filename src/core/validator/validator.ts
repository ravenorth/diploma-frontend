const EMPTY_VALUE_MSG = 'Поле обязательно'

function getFormError<T>(validator: (value: T) => string, value: T): Promise<string> {
    const error = validator(value)
    return error ? Promise.reject(new Error(error)) : Promise.resolve('')
  }

function validateNotEmptyValue(value: string): string {
    const trimmedValue = value.trim()
    if (!trimmedValue) {
        return EMPTY_VALUE_MSG
    }
    return ''
}

function validateEmail(value: string, isRequired: boolean = true) {
    const trimmedValue = value.trim()
    if (isRequired && !trimmedValue) {
        return EMPTY_VALUE_MSG
    }
    if (trimmedValue && !RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).test(trimmedValue)) {
        return 'Некорректный email'
    }
    return ''
}

function validatePhone(value: string, isRequired: boolean = true) {
    const trimmedValue = value.trim()
    if (isRequired && !trimmedValue) {
        return EMPTY_VALUE_MSG
    }
    if (trimmedValue && !RegExp(/^(\+7|8)\d{10}$/).test(trimmedValue)) {
        return 'Некорректный номер телефона'
    }
    return ''
}

function validateUrl(value: string, isRequired: boolean = true) {
    const trimmedValue = value.trim()
    if (isRequired && !trimmedValue) {
        return EMPTY_VALUE_MSG
    }
    if (trimmedValue && !RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/).test(trimmedValue)) {
        return 'Некорректный адрес ссылки'
    }
    return ''
}

function validateAddress(value: string|null, isRequired: boolean = true) {
    if (!value) {
        return EMPTY_VALUE_MSG
    }
    const trimmedValue = value.trim()
    // if (isRequired) {
    //     const emptyError = validateNotEmptyValue(trimmedValue)
    //     if (emptyError) {
    //         return emptyError
    //     }
    // }
    if (isRequired && !trimmedValue) {
        return EMPTY_VALUE_MSG
    }
    if (trimmedValue && !trimmedValue.includes(', д ')) {
        return 'Адрес должен быть полным'
    }
    return ''
}

export {
    getFormError,
    validateNotEmptyValue,
    validateEmail,
    validatePhone,
    validateUrl,
    validateAddress,
}