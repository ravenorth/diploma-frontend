import {useAction} from "@reatom/react"
import {Input, Modal, Select} from "antd";
import { FieldBlock, fieldStyle } from "../../../../../../common/popupFieldBlock/FieldBlock";
import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import { POPUP_DEFAULT_WIDTH } from "../../../../../viewModel/viewData";
import { updateUserPopupActions, updateUserPopupAtoms } from "../../../../../viewModel/usersPopup/updateUser";
import { getRoleAsSelectOptions } from "../../../../../model/users/userRole";
import { currUserAtom } from "../../../../../model/currUser/currUser";

function FullNameInput() {
    const fullName = useAtomWithSelector(updateUserPopupAtoms, x => x.fullNameAtom)
    const fullNameError = useAtomWithSelector(updateUserPopupAtoms, x => x.fullNameErrorAtom)
    const handleSetFullName = useAction(updateUserPopupActions.setFullName)

    return <Input
        value={fullName}
        status={fullNameError ? 'error' : ''}
        onChange={e => handleSetFullName(e.target.value)}
        style={fieldStyle}
    />
}

function RoleInput() {
    const currUserId = useAtomWithSelector(currUserAtom, x => x?.id)
    const id = useAtomWithSelector(updateUserPopupAtoms, x => x.idAtom)
    const role = useAtomWithSelector(updateUserPopupAtoms, x => x.roleAtom)
    const handleSetRole = useAction(updateUserPopupActions.setRole)

    return <Select
        value={role}
        onChange={handleSetRole}
        options={getRoleAsSelectOptions()}
        style={fieldStyle}
        disabled={currUserId === id}
    />
}

function UserEmailInput() {
    const email = useAtomWithSelector(updateUserPopupAtoms, x => x.emailAtom)
    const emailError = useAtomWithSelector(updateUserPopupAtoms, x => x.emailErrorAtom)
    const handleSetEmail = useAction(updateUserPopupActions.setEmail)

    return <Input
        value={email}
        status={emailError ? 'error' : ''}
        onChange={e => handleSetEmail(e.target.value)}
        style={fieldStyle}
    />
}

function Content() {
    const fullNameError = useAtomWithSelector(updateUserPopupAtoms, x => x.fullNameErrorAtom)
    const emailError = useAtomWithSelector(updateUserPopupAtoms, x => x.emailErrorAtom)

    return (
        <>
            <FieldBlock
                title={'ФИО'}
                content={<FullNameInput/>}
                error={fullNameError}
            />
            <FieldBlock
                title={'Роль'}
                content={<RoleInput/>}
            />
            <FieldBlock
                title={'Email'}
                content={<UserEmailInput/>}
                error={emailError}
            />
        </>
    )
}

function UpdateUserPopup() {
    const popupOpened = useAtomWithSelector(updateUserPopupAtoms, x => x.openedAtom)
    const mode = useAtomWithSelector(updateUserPopupAtoms, x => x.popupModeAtom)                                                                                                                                                                                                                                                                                                                                                                                         
    const loading = useAtomWithSelector(updateUserPopupAtoms, x => x.loadingAtom)
    const handleClosePopup = useAction(updateUserPopupActions.close)
    const handleSubmit = useAction(updateUserPopupActions.submit)

    const onHandleSubmitUser = () => {
        if (!loading) {
            handleSubmit()
        }
    }

    return <Modal
        title={`${(mode === 'create') ? 'Добавить': 'Редактировать'} пользователя`}
        open={popupOpened}
        centered
        okText={'Сохранить'}
        cancelText={'Отмена'}
        okButtonProps={{
            loading: loading,
            type: 'primary',
            onClick: onHandleSubmitUser,
        }}
        onCancel={handleClosePopup}
        width={POPUP_DEFAULT_WIDTH}
    >
        <Content/>
    </Modal>
}

export {
    UpdateUserPopup,
}