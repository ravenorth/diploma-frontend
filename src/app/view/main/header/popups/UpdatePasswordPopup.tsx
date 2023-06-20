import React from "react";
import {useAction} from "@reatom/react"
import {Form, Input, Modal } from "antd"
import { useAtomWithSelector } from "../../../../../core/reatom/useAtomWithSelector";
import { FieldBlock } from "../../../../../common/popupFieldBlock/FieldBlock";
import { POPUP_DEFAULT_WIDTH } from "../../../../viewModel/viewData";
import { updatePasswordPopupActions, updatePasswordPopupAtoms } from "../../../../viewModel/usersPopup/updatePasswordPopup";

const fieldStyle: React.CSSProperties = {
    width: 300,
}

function UserOldPasswordInput() {
    const userOldPassword = useAtomWithSelector(updatePasswordPopupAtoms, x => x.userOldPasswordAtom)
    const handleSetUserOldPassword = useAction(updatePasswordPopupActions.setUserOldPassword)

    return <Input.Password
        value={userOldPassword}
        onChange={e => handleSetUserOldPassword(e.target.value)}
        style={fieldStyle}
    />
}

function UserNewPasswordInput() {
    const userNewPassword = useAtomWithSelector(updatePasswordPopupAtoms, x => x.userNewPasswordAtom)
    const userNewPasswordError = useAtomWithSelector(updatePasswordPopupAtoms, x => x.userNewPasswordErrorAtom)
    const handleSetUserNewPassword = useAction(updatePasswordPopupActions.setUserNewPassword)

    return <Input.Password
        value={userNewPassword}
        status={userNewPasswordError ? 'error' : ''}
        onChange={e => handleSetUserNewPassword(e.target.value)}
        style={fieldStyle}
    />
}

function UserNewPasswordRepeatInput() {
    const userNewPasswordRepeat = useAtomWithSelector(updatePasswordPopupAtoms, x => x.userNewPasswordRepeatAtom)
    const userNewPasswordError = useAtomWithSelector(updatePasswordPopupAtoms, x => x.userNewPasswordErrorAtom)
    const handleSetUserNewPasswordRepeat = useAction(updatePasswordPopupActions.setUserNewPasswordRepeat)

    return <Input.Password
        value={userNewPasswordRepeat}
        status={userNewPasswordError ? 'error' : ''}
        onChange={e => handleSetUserNewPasswordRepeat(e.target.value)}
        style={fieldStyle}
    />
}

function Content() {
    const userNewPasswordError = useAtomWithSelector(updatePasswordPopupAtoms, x => x.userNewPasswordErrorAtom)

    return (
        <Form autoComplete={'off'} >
            <FieldBlock
                title={'Текущий пароль'}
                content={<UserOldPasswordInput />}
            />
            <FieldBlock
                title={'Новый пароль'}
                content={<UserNewPasswordInput />}
                error={userNewPasswordError}
            />
            <FieldBlock
                title={'Повторите новый пароль'}
                content={<UserNewPasswordRepeatInput />}
                error={userNewPasswordError}
            />
        </Form>
    )
}

function UpdatePasswordPopup() {                                                                                                                                                                                                                                                                                                                                                                                          
    const updatePasswordPopupOpened = useAtomWithSelector(updatePasswordPopupAtoms, x => x.openedAtom)
    const submitButtonLoading = useAtomWithSelector(updatePasswordPopupAtoms, x => x.submitButtonLoadingAtom)
    const handleClosePopup = useAction(updatePasswordPopupActions.close)
    const handleSubmit = useAction(updatePasswordPopupActions.submit)

    const onHandleSubmit = () => {
        if (!submitButtonLoading) {
            handleSubmit()
        }
    }

    return <Modal
        title={'Изменить пароль'}
        open={updatePasswordPopupOpened}
        centered
        okText={'Сохранить'}
        cancelText={'Отмена'}
        okButtonProps={{
            loading: submitButtonLoading,
            type: 'primary',
            onClick: onHandleSubmit,
        }}
        onCancel={handleClosePopup}
        width={POPUP_DEFAULT_WIDTH}
    >
        <Content/>
    </Modal>
}

export {
    UpdatePasswordPopup,
}