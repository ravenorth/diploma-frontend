import React from 'react'
import { useAction } from '@reatom/react'
import { Button, Checkbox, Form, Input } from 'antd'
import styles from "./LogIn.module.css"
import { authActions, authAtoms } from '../../../model/auth/auth'
import { resetPasswordActions } from '../../../model/auth/resetPassword'
import { useAtomWithSelector } from '../../../../core/reatom/useAtomWithSelector'

const inputStyle: React.CSSProperties = {
    fontWeight: 400,
    borderRadius: 10,
    width: 550,
    height: 45,
}

const checkboxStyle: React.CSSProperties = {
    fontFamily: 'var(--default-font-family)',
    fontWeight: 400,
    fontSize: 16,
    color: '#798398',
}

const buttonStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 500,
    fontStyle: 'normal',
    borderRadius: 10,
    width: 550,
    height: 45,
}

function LogIn() {   
    const handleLogin = useAction(authActions.login)
    const handleSetResetPasswordOpened = useAction(resetPasswordActions.setOpened)

    const email = useAtomWithSelector(authAtoms, x => x.emailAtom)
    const password = useAtomWithSelector(authAtoms, x => x.passwordAtom)
    const rememberMe = useAtomWithSelector(authAtoms, x => x.rememberMeAtom)

    const handleSetEmail = useAction(authActions.setEmail)
    const handleSetPassword = useAction(authActions.setPassword)
    const handleToggleRememberMe = useAction(authActions.toggleRememberMe)

    const loginButtonLoading = useAtomWithSelector(authAtoms, x => x.loginButtonLoadingAtom)

    const onLogIn = () => {
        if (email && password && !loginButtonLoading) {
            handleLogin({
                rememberMe,
                email,
                password,
            })
        }
    }

    return (
        <div className={styles.content}>
            <label className={styles.header}>
                Вход в личный кабинет
            </label>
            <Form
                name="login"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete="on"
            >
                <Form.Item
                    name="userName"
                    style={inputStyle}
                >
                    <Input placeholder='Email' 
                        value={email} 
                        onChange={e => handleSetEmail(e.target.value)} 
                        style={inputStyle} 
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    style={inputStyle}
                >
                    <Input.Password 
                        placeholder='Пароль' 
                        value={password} 
                        onChange={e => handleSetPassword(e.target.value)} 
                        style={inputStyle} 
                    />
                </Form.Item>
            </Form>
            <div className={styles.between}>
                <Checkbox style={checkboxStyle} checked={rememberMe} onChange={e => handleToggleRememberMe()}>
                    Запомнить меня
                </Checkbox>
                <label 
                    onClick={() => handleSetResetPasswordOpened(true)}
                    className={styles.reset}
                >
                    Забыли пароль?
                </label>
            </div>
            <Button 
                type="primary" 
                onClick={onLogIn} 
                style={buttonStyle}
                loading={loginButtonLoading}
            >
                Войти
            </Button>
        </div>
    )
}

export {
    LogIn,
}