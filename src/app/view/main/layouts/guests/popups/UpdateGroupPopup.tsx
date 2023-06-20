import {useAction, useAtom} from "@reatom/react"
import { DatePicker, Input, Modal, Select } from "antd";
import { FieldBlock, fieldStyle } from "../../../../../../common/popupFieldBlock/FieldBlock";
import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import { POPUP_DEFAULT_WIDTH } from "../../../../../viewModel/viewData";
import { remapToSelectOption } from "../../../../../../core/utils/option";
import { useEffect, useMemo } from "react";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { DMY_TIME_FORMAT } from "../../../../../../core/time/time";
import { getCategoryTypeAsSelectOptions } from "../../../../../model/hotels/categoryData";
import { Preloader } from "../../../../../../common/preloader/Preloader";
import { currUserAtom } from "../../../../../model/currUser/currUser";
import { updateGroupPopupActions, updateGroupPopupAtoms } from "../../../../../viewModel/guestsPopup/updateGroup";
import { usersOptionsActions, usersOptionsAtoms } from "../../../../../model/users/usersOptions";
import { eventsActions, eventsAtoms } from "../../../../../model/events/events";

const { RangePicker } = DatePicker

function NameInput() {
    const name = useAtomWithSelector(updateGroupPopupAtoms, x => x.nameAtom)
    const nameError = useAtomWithSelector(updateGroupPopupAtoms, x => x.nameErrorAtom)
    const handleSetFullName = useAction(updateGroupPopupActions.setName)

    return <Input
        value={name}
        status={nameError ? 'error' : ''}
        onChange={e => handleSetFullName(e.target.value)}
        style={fieldStyle}
    />
}

function PreferredCategoryInput() {
    const category = useAtomWithSelector(updateGroupPopupAtoms, x => x.preferredCategoryAtom)
    const handleSetCategory = useAction(updateGroupPopupActions.setPreferredCategory)

    return <Select
        value={category}
        onChange={handleSetCategory}
        options={getCategoryTypeAsSelectOptions()}
        style={fieldStyle}
    />
}

function DatesInput() {
    const start = useAtomWithSelector(updateGroupPopupAtoms, x => x.checkinAtom)
    const end = useAtomWithSelector(updateGroupPopupAtoms, x => x.checkoutAtom)
    const datesError = useAtomWithSelector(updateGroupPopupAtoms, x => x.datesErrorAtom)
    const handleSetStart = useAction(updateGroupPopupActions.setCheckin)
    const handleSetEnd = useAction(updateGroupPopupActions.setCheckout)

    const onChange = (value: RangePickerProps['value']) => {
        if (value) {
            handleSetStart(value[0] || dayjs())
            handleSetEnd(value[1] || dayjs())
        }
    }

    return <RangePicker
        value={[start, end]}
        onChange={value => onChange(value)}
        format={DMY_TIME_FORMAT}
        status={datesError ? 'error' : ''}
        style={fieldStyle}
    />
}

function ManagerInput() {
    const manager = useAtomWithSelector(updateGroupPopupAtoms, x => x.managerAtom)
    const handleSetManager = useAction(updateGroupPopupActions.setManager)
    const managerOptions = useAtomWithSelector(usersOptionsAtoms, x => x.managerOptionsAtom)
    const groupOptions = useMemo(() => managerOptions.map(item => remapToSelectOption(item.id, item.fullName)), [managerOptions])

    const handleOnChange = (value?: {
        value: string;
        label: string;
    } | null | undefined) => {
        handleSetManager(
            value
            ? {
                id: value?.value,
                fullName: value?.label,
            }
            : null
        )
    }

    return <Select
        labelInValue={true}
        value={manager ? { value: manager?.id, label: manager?.fullName } : undefined}
        onChange={handleOnChange}
        options={groupOptions}
        allowClear={true}
        showSearch
        placeholder="Поиск..."
        style={fieldStyle}
    />
}

function Content() {
    const currUser = useAtom(currUserAtom)
    const nameError = useAtomWithSelector(updateGroupPopupAtoms, x => x.nameErrorAtom)
    const datesError = useAtomWithSelector(updateGroupPopupAtoms, x => x.datesErrorAtom)

    return (
        <>
            <FieldBlock
                title={'Имя'}
                content={<NameInput />}
                error={nameError}
            />
            <FieldBlock
                title={'Предпочитаемая категория'}
                content={<PreferredCategoryInput />}
            />
            <FieldBlock
                title={'Даты проживания'}
                content={<DatesInput />}
                error={datesError}
            />
            {currUser?.role !== 'manager' &&
                <FieldBlock
                    title={'Менеджер'}
                    content={<ManagerInput />}
                />
            }
        </>
    )
}

function UpdateGroupPopup() {
    const currEventId = useAtomWithSelector(eventsAtoms, x => x.currEventIdAtom)
    const popupOpened = useAtomWithSelector(updateGroupPopupAtoms, x => x.openedAtom)
    const mode = useAtomWithSelector(updateGroupPopupAtoms, x => x.popupModeAtom)                                                                                                                                                                                                                                                                                                                                                                                         
    const loading = useAtomWithSelector(updateGroupPopupAtoms, x => x.loadingAtom)
    const handleClosePopup = useAction(updateGroupPopupActions.close)
    const handleSubmit = useAction(updateGroupPopupActions.submit)
    const handleGetManagerOptions = useAction(usersOptionsActions.getManagers)
    const handleGetCurrEventData = useAction(eventsActions.getEventData)

    const onHandleSubmitGroup = () => {
        if (!loading) {
            handleSubmit()
        }
    }

    useEffect(() => {
        if (popupOpened) {
            handleGetManagerOptions()
            handleGetCurrEventData(currEventId)
        }
    }, [handleGetManagerOptions, handleGetCurrEventData, popupOpened, currEventId])

    return <Modal
        title={`${(mode === 'create') ? 'Добавить': 'Редактировать'} группу`}
        open={popupOpened}
        centered
        okText={'Сохранить'}
        cancelText={'Отмена'}
        okButtonProps={{
            loading: loading,
            type: 'primary',
            onClick: onHandleSubmitGroup,
        }}
        onCancel={handleClosePopup}
        width={POPUP_DEFAULT_WIDTH}
    >
        {loading
        ? <Preloader size="large" />
        : <Content />}     
    </Modal>
}

export {
    UpdateGroupPopup,
}