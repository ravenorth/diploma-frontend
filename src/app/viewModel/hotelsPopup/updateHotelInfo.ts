import { combine, declareAction, declareAtom } from "@reatom/core"
import { Dayjs } from "dayjs"
import { HotelInfoData } from "../../model/hotels/hotelData"
import { hotelsActions } from "../../model/hotels/hotels"
import { declareAtomWithSetter } from "../../../core/reatom/declareAtomWithSetter"
import { remapStringToHM } from "../../../core/time/time"
import { UserData } from "../../model/users/userData"
import { SelectOption } from "../viewData"
import { declareAsyncAction } from "../../../core/reatom/declareAsyncAction"
import { getAddressOptions } from "../../../api/addressApi"
import { Toasts } from "../../../common/toasts/toasts"
import { usersOptionsActions } from "../../model/users/usersOptions"
import { validateAddress, validateEmail, validateNotEmptyValue, validatePhone, validateUrl } from "../../../core/validator/validator"
import { eventsAtoms } from "../../model/events/events"

type ModeType = 'create' | 'edit'

type OpenPayload = {
    mode: 'create',
} | {
    mode: 'edit',
    data: HotelInfoData,
}

const open = declareAction<OpenPayload>('updateHotelInfoPopup.open')
const close = declareAction('updateHotelInfoPopup.close')

const openedAtom = declareAtom('updateHotelInfoPopup.opened', false, on => [
    on(open, () => true),
    on(close, () => false),
    on(hotelsActions.createHotel.done, () => false),
    on(hotelsActions.editHotel.done, () => false),
])

const popupModeAtom = declareAtom<ModeType>('updateHotelInfoPopup.popupMode', 'edit', on => [
    on(open, (_, value) => value.mode)
])

const idAtom = declareAtom<string|null>('updateHotelInfoPopup.id', null, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.id : null)
])

const [nameAtom, setName] = declareAtomWithSetter<string>('updateHotelInfoPopup.name', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.name : ''),
])

const [checkinAtom, setCheckin] = declareAtomWithSetter<Dayjs>('updateHotelInfoPopup.checkin', remapStringToHM('12:00'), on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.checkin : remapStringToHM('12:00')),
])

const [checkoutAtom, setCheckout] = declareAtomWithSetter<Dayjs>('updateHotelInfoPopup.checkout', remapStringToHM('12:00'), on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.checkout : remapStringToHM('12:00')),
])

const [cancelConditionAtom, setCancelCondition] = declareAtomWithSetter<string>('updateHotelInfoPopup.cancelCondition', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.cancelCondition : ''),
])

const [hotelUserAtom, setHotelUser] = declareAtomWithSetter<UserData|null>('updateHotelInfoPopup.hotelUser', null, on => [
    on(open, (_, value) => (value.mode === 'edit' ? value.data.hotelUser : null) || null),
])

const [phoneAtom, setPhone] = declareAtomWithSetter<string>('updateHotelInfoPopup.phone', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.phone : ''),
])

const [emailAtom, setEmail] = declareAtomWithSetter<string>('updateHotelInfoPopup.email', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.email : ''),
])

const [linkAtom, setLink] = declareAtomWithSetter<string>('updateHotelInfoPopup.link', '', on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.link : ''),
])

const [addressAtom, setAddress] = declareAtomWithSetter<string|null>('updateHotelInfoPopup.address', null, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.address : null),
])

const [starsAtom, setStars] = declareAtomWithSetter<number>('updateHotelInfoPopup.stars', 0, on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.stars : 0),
])

const updateManagers = declareAction<SelectOption[]>('updateHotelInfoPopup.updateManagers')

const managersAtom = declareAtom<UserData[]>('updateHotelInfoPopup.managers', [], on => [
    on(open, (_, value) => value.mode === 'edit' ? value.data.managerUsers : []),
    on(updateManagers, (_, value) => value.map(item => ({
        id: item.value,
        fullName: item.label,
    }))),
])

const [addressOptionsAtom, setAddressOptions] = declareAtomWithSetter<string[]>('updateHotelInfoPopup.addressOptions', [], on => [
    on(open, (_, value) => value.mode === 'edit' ? [value.data.address] : []),
])

const updateAdressOptions = declareAsyncAction<string>('updateHotelInfoPopup.updateAdressOptions',
    (query, store) => {
        return getAddressOptions(query)
            .then(({suggestions}) => {
                store.dispatch(setAddressOptions(suggestions.map((item: any) => item.value)))
            })
            .catch(() => {
                Toasts.error('Не удалось получить возможные адреса')
            })
    }
)

const [nameErrorAtom, setNameError] = declareAtomWithSetter<string>('updateHotelInfoPopup.nameError', '', on => [
    on(setName, () => ''),
    on(open, () => '')
])

const [phoneErrorAtom, setPhoneError] = declareAtomWithSetter<string>('updateHotelInfoPopup.phoneError', '', on => [
    on(setPhone, () => ''),
    on(open, () => '')
])

const [emailErrorAtom, setEmailError] = declareAtomWithSetter<string>('updateHotelInfoPopup.emailError', '', on => [
    on(setEmail, () => ''),
    on(open, () => '')
])

const [linkErrorAtom, setLinkError] = declareAtomWithSetter<string>('updateHotelInfoPopup.linkError', '', on => [
    on(setLink, () => ''),
    on(open, () => '')
])

const [addressErrorAtom, setAddressError] = declareAtomWithSetter<string>('updateHotelInfoPopup.addressError', '', on => [
    on(setAddress, () => ''),
    on(open, () => '')
])

const addressOptionsLoadingAtom = declareAtom<boolean>('updateHotelInfoPopup.addressOptionsLoading', false, on => [
    on(updateAdressOptions, () => true),
    on(updateAdressOptions.done, () => false),
    on(updateAdressOptions.fail, () => false),
])

const loadingAtom = declareAtom<boolean>('updateHotelInfoPopup.loading', false, on => [
    on(hotelsActions.createHotel, () => true),
    on(hotelsActions.createHotel.done, () => false),
    on(hotelsActions.createHotel.fail, () => false),
    on(hotelsActions.editHotel, () => true),
    on(hotelsActions.editHotel.done, () => false),
    on(hotelsActions.editHotel.fail, () => false),
    on(usersOptionsActions.getManagers, () => true),
    on(usersOptionsActions.getManagers.done, () => false),
    on(usersOptionsActions.getManagers.fail, () => false),
    on(usersOptionsActions.getHotelUsers, () => true),
    on(usersOptionsActions.getHotelUsers.done, () => false),
    on(usersOptionsActions.getHotelUsers.fail, () => false),
    on(close, () => false),
])

const submit = declareAction('updateHotelInfoPopup.submit',
    (_, store) => {
        const popupMode = store.getState(popupModeAtom)
        const name = store.getState(nameAtom)
        const checkin = store.getState(checkinAtom)
        const checkout = store.getState(checkoutAtom)
        const cancelCondition = store.getState(cancelConditionAtom)
        const phone = store.getState(phoneAtom)
        const email = store.getState(emailAtom)
        const link = store.getState(linkAtom)
        const address = store.getState(addressAtom)
        const stars = store.getState(starsAtom)
        const hotelUser = store.getState(hotelUserAtom)
        const managers = store.getState(managersAtom)

        const nameError = validateNotEmptyValue(name)
        const phoneError = validatePhone(phone, false)
        const emailError = validateEmail(email, false)
        const linkError = validateUrl(link, false)
        const addressError = validateAddress(address)

        if (nameError || phoneError || emailError || linkError) {
            store.dispatch(setNameError(nameError))
            store.dispatch(setPhoneError(phoneError))
            store.dispatch(setEmailError(emailError))
            store.dispatch(setLinkError(linkError))
            store.dispatch(setAddressError(addressError))
            return
        }

        if (popupMode === 'create') {
            const currEventId = store.getState(eventsAtoms).currEventIdAtom 
            store.dispatch(hotelsActions.createHotel({
                eventId: currEventId,
                hotelData: {
                    name,
                    checkin,
                    checkout,
                    cancelCondition,
                    phone,
                    email,
                    link,
                    address: address || '',
                    stars,
                    hotelUser: hotelUser || undefined,
                    managerUsers: managers,
                }
            }))
        }
        else {
            const id = store.getState(idAtom)
            const eventId = store.getState(eventsAtoms).currEventIdAtom
            if (id) store.dispatch(hotelsActions.editHotel({
                id,
                eventId,
                name,
                checkin,
                checkout,
                cancelCondition,
                phone,
                email,
                link,
                address: address || '',
                stars,
                hotelUser: hotelUser || undefined,
                managerUsers: managers,
            }))
        }
    }
)

const updateHotelInfoPopupAtoms = combine({
    popupModeAtom,
    openedAtom,
    idAtom,
    nameAtom,
    checkinAtom,
    checkoutAtom,
    cancelConditionAtom,
    nameErrorAtom,
    loadingAtom,
    hotelUserAtom,
    managersAtom,
    phoneAtom,
    emailAtom,
    linkAtom,
    addressAtom,
    starsAtom,
    phoneErrorAtom,
    emailErrorAtom,
    linkErrorAtom,
    addressErrorAtom,
    addressOptionsAtom,
    addressOptionsLoadingAtom,
})

const updateHotelInfoPopupActions = {
    open,
    close,
    setName,
    setCheckin,
    setCheckout,
    setCancelCondition,
    setNameError,
    submit,
    setHotelUser,
    updateManagers,
    setPhone,
    setEmail,
    setLink,
    setAddress,
    setStars,
    updateAdressOptions,
}

export {
    updateHotelInfoPopupAtoms,
    updateHotelInfoPopupActions,
}