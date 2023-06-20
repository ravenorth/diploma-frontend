import {useAction, useAtom} from "@reatom/react"
import { FieldBlock, fieldStyle } from "../../../../../../common/popupFieldBlock/FieldBlock";
import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import { AutoComplete, Input, Modal, Rate, Select, Spin, TimePicker } from "antd";
import { HM_TIME_FORMAT } from "../../../../../../core/time/time";
import TextArea from "antd/es/input/TextArea";
import { Preloader } from "../../../../../../common/preloader/Preloader";
import { useEffect, useMemo } from "react";
import { remapToSelectOption } from "../../../../../../core/utils/option";
import { currUserAtom } from "../../../../../model/currUser/currUser";
import { updateHotelInfoPopupActions, updateHotelInfoPopupAtoms } from "../../../../../viewModel/hotelsPopup/updateHotelInfo";
import { usersOptionsActions, usersOptionsAtoms } from "../../../../../model/users/usersOptions";

function NameInput() {
    const name = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.nameAtom)
    const nameError = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.nameErrorAtom)
    const handleSetFullName = useAction(updateHotelInfoPopupActions.setName)

    return <Input
        value={name}
        status={nameError ? 'error' : ''}
        onChange={e => handleSetFullName(e.target.value)}
        style={fieldStyle}
    />
}

function CheckinInput() {
    const checkin = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.checkinAtom)
    const handleSetCheckin = useAction(updateHotelInfoPopupActions.setCheckin)

    return <TimePicker
        value={checkin}
        onSelect={(value) => handleSetCheckin(value || '')}
        style={fieldStyle}
        format={HM_TIME_FORMAT}
        showNow={false}
    />
}

function CheckoutInput() {
    const checkout = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.checkoutAtom)
    const handleSetCheckout = useAction(updateHotelInfoPopupActions.setCheckout)

    return <TimePicker
        value={checkout}
        onSelect={(value) => handleSetCheckout(value || '')}
        style={fieldStyle}
        format={HM_TIME_FORMAT}
        showNow={false}
    />
}

function CancelConditionInput() {
    const cancelCondition = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.cancelConditionAtom)
    const handleSetCancelCondition = useAction(updateHotelInfoPopupActions.setCancelCondition)

    return <TextArea
        value={cancelCondition}
        onChange={(e) => handleSetCancelCondition(e.target.value)}
        placeholder="Введите условия отмены..."
        autoSize={{ minRows: 3, maxRows: 5 }}
        style={fieldStyle}
      />
}

function PhoneInput() {
    const phone = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.phoneAtom)
    const error = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.phoneErrorAtom)
    const handleSetPhone = useAction(updateHotelInfoPopupActions.setPhone)

    return <Input
        value={phone}
        status={error ? 'error' : ''}
        onChange={e => handleSetPhone(e.target.value)}
        style={fieldStyle}
    />
}

function EmailInput() {
    const email = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.emailAtom)
    const error = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.emailErrorAtom)
    const handleSetEmail = useAction(updateHotelInfoPopupActions.setEmail)

    return <Input
        value={email}
        status={error ? 'error' : ''}
        onChange={e => handleSetEmail(e.target.value)}
        style={fieldStyle}
    />
}

function LinkInput() {
    const link = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.linkAtom)
    const error = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.linkErrorAtom)
    const handleSetFullName = useAction(updateHotelInfoPopupActions.setLink)

    return <Input
        value={link}
        status={error ? 'error' : ''}
        onChange={e => handleSetFullName(e.target.value)}
        style={fieldStyle}
    />
}

function StarsInput() {
    const stars = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.starsAtom)
    const handleSetStars = useAction(updateHotelInfoPopupActions.setStars)

    return <Rate
        value={stars}
        onChange={handleSetStars}
        style={fieldStyle}
    />
}

function AddressInput() {
    const address = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.addressAtom)
    const error = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.addressErrorAtom)
    const addressOptions = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.addressOptionsAtom)
    const loading = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.addressOptionsLoadingAtom)
    const handleSetAddress = useAction(updateHotelInfoPopupActions.setAddress)
    const handleUpdateOptions = useAction(updateHotelInfoPopupActions.updateAdressOptions)
    const options = useMemo(() => addressOptions.map((item: any) => remapToSelectOption(item, item)), [addressOptions])

    return <AutoComplete
        value={address}
        status={error ? 'error' : ''}
        onChange={handleSetAddress}
        onSearch={handleUpdateOptions}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder="Введите адрес..."
        options={options}
        style={fieldStyle}
    />
}

function HotelUserInput() {
    const hotelUser = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.hotelUserAtom)
    const hotelOptions = useAtomWithSelector(usersOptionsAtoms, x => x.hotelUsersOptionsAtom)
    const handleSetHotelUser = useAction(updateHotelInfoPopupActions.setHotelUser)
    const options = useMemo(() => hotelOptions.map(item => remapToSelectOption(item.id, item.fullName)), [hotelOptions])

    return <Select
        labelInValue={true}
        value={hotelUser ? { value: hotelUser.id, label: hotelUser.fullName } : null}
        onChange={(value) => handleSetHotelUser({id: value?.value, fullName: value?.label})}
        showSearch
        placeholder="Поиск..."
        style={fieldStyle}
        options={options}
        allowClear={true}
    />
}

function ManagersInput() {
    const managers = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.managersAtom)
    const managerOptions = useAtomWithSelector(usersOptionsAtoms, x => x.managerOptionsAtom)
    const handleSetManagers = useAction(updateHotelInfoPopupActions.updateManagers)

    const options = useMemo(() => managerOptions.map(item => remapToSelectOption(item.id, item.fullName)), [managerOptions])
    const selectedOptions = useMemo(() => managers.map(item => remapToSelectOption(item.id, item.fullName)), [managers])

    return <Select
        labelInValue={true}
        mode="multiple"
        allowClear
        value={selectedOptions}
        onChange={(value) => handleSetManagers(value)}
        style={fieldStyle}
        placeholder="Поиск..."
        options={options}
    />
}

function Content() {
    const currUser = useAtom(currUserAtom)
    const nameError = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.nameErrorAtom)
    const phoneError = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.phoneErrorAtom)
    const emailError = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.emailErrorAtom)
    const linkError = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.linkErrorAtom)
    const addressError = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.addressErrorAtom)

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{width: 460}}>
                <FieldBlock
                    title={'Название'}
                    content={<NameInput/>}
                    error={nameError}
                />
                <FieldBlock
                    title={'Количество звёзд'}
                    content={<StarsInput/>}
                />
                <FieldBlock
                    title={'Адресс'}
                    content={<AddressInput/>}
                    error={addressError}
                />
                <FieldBlock
                    title={'Время заезда'}
                    content={<CheckinInput/>}
                />
                <FieldBlock
                    title={'Время выезда'}
                    content={<CheckoutInput/>}
                />
                <FieldBlock
                    title={'Условия отмены'}
                    content={<CancelConditionInput/>}
                />
            </div>
            <div style={{width: 460, marginLeft: 30}}>
                <FieldBlock
                    title={'Телефон'}
                    content={<PhoneInput/>}
                    error={phoneError}
                />
                <FieldBlock
                    title={'Email'}
                    content={<EmailInput/>}
                    error={emailError}
                />
                <FieldBlock
                    title={'Ссылка'}
                    content={<LinkInput/>}
                    error={linkError}
                />
                {currUser?.role !== 'hotel' && <>
                    <FieldBlock
                        title={'Менеджеры'}
                        content={<ManagersInput/>}
                    />
                    <FieldBlock
                        title={'Представитель отеля'}
                        content={<HotelUserInput/>}
                    />
                </>}
            </div>
        </div>
    )
}

function UpdateHotelInfoPopup() {
    const currUserRole = useAtomWithSelector(currUserAtom, x => x?.role)
    const popupOpened = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.openedAtom)
    const mode = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.popupModeAtom)                                                                                                                                                                                                                                                                                                                                                                                         
    const loading = useAtomWithSelector(updateHotelInfoPopupAtoms, x => x.loadingAtom)
    const handleClosePopup = useAction(updateHotelInfoPopupActions.close)
    const handleSubmit = useAction(updateHotelInfoPopupActions.submit)

    useAtomWithSelector(usersOptionsAtoms, x => x.hotelUsersOptionsAtom)
    useAtomWithSelector(usersOptionsAtoms, x => x.managerOptionsAtom)

    const handleGetManagers = useAction(usersOptionsActions.getManagers)
    const handleGetHotelUsers = useAction(usersOptionsActions.getHotelUsers)

    useEffect(() => {
        if (popupOpened && currUserRole !== 'hotel') {
            handleGetManagers()
            handleGetHotelUsers()
        }
    }, [handleGetManagers, handleGetHotelUsers, popupOpened, currUserRole])

    const onHandleSubmitHotel = () => {
        if (!loading) {
            handleSubmit()
        }
    }

    return <Modal
        title={`${(mode === 'create') ? 'Добавить': 'Редактировать'} гостиницу`}
        open={popupOpened}
        centered
        okText={'Сохранить'}
        cancelText={'Отмена'}
        okButtonProps={{
            loading: loading,
            type: 'primary',
            onClick: onHandleSubmitHotel,
        }}
        onCancel={handleClosePopup}
        width={950}
    >
        {loading
        ? <Preloader size="large" />
        : <Content />}
    </Modal>
}

export {
    UpdateHotelInfoPopup,
}