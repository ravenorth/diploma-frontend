import { Button, Input } from "antd"
import styles from "./ResetPassword.module.css"
import { useAction } from "@reatom/react"
import { resetPasswordActions, resetPasswordAtoms } from "../../../model/auth/resetPassword"
import { useAtomWithSelector } from "../../../../core/reatom/useAtomWithSelector"

const inputStyle: React.CSSProperties = {
    fontWeight: 400,
    borderRadius: 10,
    width: 550,
    height: 45,
    marginTop: 25,
}

const buttonStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 500,
    fontStyle: 'normal',
    borderRadius: 10,
    width: 550,
    height: 45,
    marginTop: 25,
}

function ResetPassword() {
    const state = useAtomWithSelector(resetPasswordAtoms, x => x.stateAtom)
    const resetButtonLoading = useAtomWithSelector(resetPasswordAtoms, x => x.resetButtonLoadingAtom)

    const email = useAtomWithSelector(resetPasswordAtoms, x => x.emailAtom)
    const code = useAtomWithSelector(resetPasswordAtoms, x => x.codeAtom)
    const password = useAtomWithSelector(resetPasswordAtoms, x => x.newPasswordAtom)
    const passwordRepeat = useAtomWithSelector(resetPasswordAtoms, x => x.newPasswordRepeatAtom)

    const handleSetEmail = useAction(resetPasswordActions.setEmail)
    const handleSetCode = useAction(resetPasswordActions.setCode)
    const handleSetPassword = useAction(resetPasswordActions.setNewPassword)
    const handleSetPasswordRepeat = useAction(resetPasswordActions.setNewPasswordRepeat)

    const handleSendCode = useAction(resetPasswordActions.sendCode)
    const handleVerifyCode = useAction(resetPasswordActions.verifyCode)
    const handleResetPassword = useAction(resetPasswordActions.resetPassword)

    const onHandleSendCode = () => {
        if (!resetButtonLoading) {
            handleSendCode(email)
        }
    }

    const onHandleVerifyCode = () => {
        if (!resetButtonLoading) {
            handleVerifyCode({
                email,
                code,
            })
        }
    }

    const onHandleResetPassword = () => {
        if (!resetButtonLoading) {
            handleResetPassword({
                email,
                newPassword: password,
                newPasswordRepeat: passwordRepeat,
            })
        }
    }

    if (state === 1) {
        return (
            <div className={styles.content}>
                <label className={styles.header}>
                    Введите код из письма
                </label>
                <label className={styles.text}>
                    Код отправлен на почту
                </label>
                <label className={styles.email}>
                    {email}
                </label>
                <Input placeholder='Код' 
                    value={code} 
                    onChange={e => handleSetCode(e.target.value)} 
                    style={inputStyle} 
                />
                <Button 
                    type="primary" 
                    onClick={onHandleVerifyCode} 
                    style={buttonStyle}
                    loading={resetButtonLoading}
                >
                    Подтвердить
                </Button>
            </div>
        )   
    }

    if (state === 2) {
        return (
            <div className={styles.content}>
                <label className={styles.header}>
                    Придумайте новый пароль
                </label>
                <Input.Password 
                    placeholder='Пароль' 
                    value={password} 
                    onChange={e => handleSetPassword(e.target.value)} 
                    style={inputStyle} 
                />
                <Input.Password 
                    placeholder='Подтвердить пароль' 
                    value={passwordRepeat} 
                    onChange={e => handleSetPasswordRepeat(e.target.value)} 
                    style={inputStyle} 
                />
                <Button 
                    type="primary" 
                    onClick={onHandleResetPassword} 
                    style={buttonStyle}
                    loading={resetButtonLoading}
                >
                    Подтвердить
                </Button>
            </div>
        )
    }

    return (
        <div className={styles.content}>
            <label className={styles.header}>
                Восстановление
            </label>
            <label className={styles.text}>
                Введите email, который привязан к вашему аккаунту
            </label>
            <Input
                placeholder='Email' 
                value={email} 
                onChange={e => handleSetEmail(e.target.value)} 
                style={inputStyle} 
            />
            <Button 
                type="primary" 
                onClick={onHandleSendCode} 
                style={buttonStyle}
                loading={resetButtonLoading}
            >
                Подтвердить
            </Button>
        </div>
    )
}

export {
    ResetPassword,
}