import React from 'react'
import { Alert } from 'react-native'
import { observer } from 'mobx-react'

import { validate as validateEmail } from 'email-validator'

import Login, { SIGN_IN, REGISTER } from './Login'

import AuthService from '../services/AuthService'

interface Props {
    children: React.ReactNode
}

async function signInOrSignUp(email: string, password: string, operation: string) {
    if (!validateEmail(email)) {
        return
    }

    if (operation == SIGN_IN) {
        try {
            const user = await AuthService.signIn(email, password)
            if (!user) {
                console.log('Test2')
                Alert.alert('Error', 'User does not exist')
            }
        } catch (error) {
            Alert.alert('Error', 'Username or password is incorrect')
        }
    }

    if (operation == REGISTER) {
        try {
            const user = await AuthService.createUser(email, password)
            if (!user) {
                Alert.alert('Error', 'User does not exist')
            }
        } catch (error) {
            Alert.alert('Error', 'Could not create user')
        }
    }
}

/**
 * LoginGuard checks if the user is logged in, and shows different content accordingly.
 *
 * If false --> shows login screen
 * If true  --> shows children
 *
 * Technical notes:
 * observer() is what allows our component to re-render every time the user changes.
 */
const LoginGuard: React.FC<Props> = observer(({ children }: Props) => {
    if (!AuthService.isLoggedIn) {
        return <Login onSubmit={signInOrSignUp} />
    }

    return <>{children}</>
})

export default LoginGuard
