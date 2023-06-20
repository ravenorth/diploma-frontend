import { useAtom } from '@reatom/react'
import { Redirect } from 'react-router-dom'
import { Router } from '../../../core/router/router'
import { LogIn } from './login/LogIn'
import { ResetPassword } from './resetPassword/ResetPassword'
import { currUserAtom } from '../../model/currUser/currUser'
import { resetPasswordAtoms } from '../../model/auth/resetPassword'
import { useAtomWithSelector } from '../../../core/reatom/useAtomWithSelector'

function AuthLayout() {   
    const currUser = useAtom(currUserAtom)
    const resetPasswordOpened = useAtomWithSelector(resetPasswordAtoms, x => x.openedAtom)

    if (currUser) {
        return <Redirect to={Router.Main.url()} />
    }

    return (
        <>
            {
                resetPasswordOpened
                    ? <ResetPassword /> 
                    : <LogIn />
            }
        </>
    )
}

export {
    AuthLayout,
}