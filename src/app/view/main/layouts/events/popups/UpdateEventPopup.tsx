import {useAction} from "@reatom/react"
import {DatePicker, Input, Modal} from "antd";
import { FieldBlock, fieldStyle } from "../../../../../../common/popupFieldBlock/FieldBlock";
import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import { POPUP_DEFAULT_WIDTH } from "../../../../../viewModel/viewData";
import { DMY_TIME_FORMAT } from "../../../../../../core/time/time";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import { updateEventPopupActions, updateEventPopupAtoms } from "../../../../../viewModel/eventsPopup/updateEvent";

const { RangePicker } = DatePicker

function NameInput() {
    const name = useAtomWithSelector(updateEventPopupAtoms, x => x.nameAtom)
    const nameError = useAtomWithSelector(updateEventPopupAtoms, x => x.nameErrorAtom)
    const handleSetFullName = useAction(updateEventPopupActions.setName)

    return <Input
        value={name}
        status={nameError ? 'error' : ''}
        onChange={e => handleSetFullName(e.target.value)}
        style={fieldStyle}
    />
}

function DateInput() {
    const start = useAtomWithSelector(updateEventPopupAtoms, x => x.startAtom)
    const end = useAtomWithSelector(updateEventPopupAtoms, x => x.endAtom)
    const handleSetStart = useAction(updateEventPopupActions.setStart)
    const handleSetEnd = useAction(updateEventPopupActions.setEnd)

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
        style={fieldStyle}
    />
}

function Content() {
    const nameError = useAtomWithSelector(updateEventPopupAtoms, x => x.nameErrorAtom)

    return (
        <>
            <FieldBlock
                title={'Название'}
                content={<NameInput/>}
                error={nameError}
            />
            <FieldBlock
                title={'Даты'}
                content={<DateInput/>}
            />
        </>
    )
}

function UpdateEventPopup() {
    const popupOpened = useAtomWithSelector(updateEventPopupAtoms, x => x.openedAtom)
    const mode = useAtomWithSelector(updateEventPopupAtoms, x => x.popupModeAtom)                                                                                                                                                                                                                                                                                                                                                                                         
    const loading = useAtomWithSelector(updateEventPopupAtoms, x => x.loadingAtom)
    const handleClosePopup = useAction(updateEventPopupActions.close)
    const handleSubmit = useAction(updateEventPopupActions.submit)

    const onHandleSubmitEvent = () => {
        if (!loading) {
            handleSubmit()
        }
    }

    return <Modal
        title={`${(mode === 'create') ? 'Добавить': 'Редактировать'} мероприятие`}
        open={popupOpened}
        centered
        okText={'Сохранить'}
        cancelText={'Отмена'}
        okButtonProps={{
            loading: loading,
            type: 'primary',
            onClick: onHandleSubmitEvent,
        }}
        onCancel={handleClosePopup}
        width={POPUP_DEFAULT_WIDTH}
    >
        <Content />
    </Modal>
}

export {
    UpdateEventPopup,
}