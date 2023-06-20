import {useAction} from "@reatom/react"
import { Input, Modal } from "antd";
import { FieldBlock, fieldStyle } from "../../../../../../common/popupFieldBlock/FieldBlock";
import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import { POPUP_DEFAULT_WIDTH } from "../../../../../viewModel/viewData";
import { updateGuestPopupActions, updateGuestPopupAtoms } from "../../../../../viewModel/guestsPopup/updateGuest";

function NameInput() {
    const name = useAtomWithSelector(updateGuestPopupAtoms, x => x.nameAtom)
    const nameError = useAtomWithSelector(updateGuestPopupAtoms, x => x.nameErrorAtom)
    const handleSetFullName = useAction(updateGuestPopupActions.setName)

    return <Input
        value={name}
        status={nameError ? 'error' : ''}
        onChange={e => handleSetFullName(e.target.value)}
        style={fieldStyle}
    />
}

function ContactInput() {
    const contact = useAtomWithSelector(updateGuestPopupAtoms, x => x.contactAtom)
    const handleSetContact = useAction(updateGuestPopupActions.setContact)

    return <Input
        value={contact}
        onChange={e => handleSetContact(e.target.value)}
        style={fieldStyle}
    />
}

function Content() {
    const nameError = useAtomWithSelector(updateGuestPopupAtoms, x => x.nameErrorAtom)

    return (
        <>
            <FieldBlock
                title={'Имя'}
                content={<NameInput />}
                error={nameError}
            />
            <FieldBlock
                title={'Контакт'}
                content={<ContactInput />}
            />
        </>
    )
}

function UpdateGuestPopup() {
    const popupOpened = useAtomWithSelector(updateGuestPopupAtoms, x => x.openedAtom)
    const mode = useAtomWithSelector(updateGuestPopupAtoms, x => x.popupModeAtom)                                                                                                                                                                                                                                                                                                                                                                                         
    const loading = useAtomWithSelector(updateGuestPopupAtoms, x => x.loadingAtom)
    const handleClosePopup = useAction(updateGuestPopupActions.close)
    const handleSubmit = useAction(updateGuestPopupActions.submit)

    const onHandleSubmitGuest = () => {
        if (!loading) {
            handleSubmit()
        }
    }

    return <Modal
        title={`${(mode === 'create') ? 'Добавить': 'Редактировать'} гостя`}
        open={popupOpened}
        centered
        okText={'Сохранить'}
        cancelText={'Отмена'}
        okButtonProps={{
            loading: loading,
            type: 'primary',
            onClick: onHandleSubmitGuest,
        }}
        onCancel={handleClosePopup}
        width={POPUP_DEFAULT_WIDTH}
    >
        <Content />    
    </Modal>
}

export {
    UpdateGuestPopup,
}