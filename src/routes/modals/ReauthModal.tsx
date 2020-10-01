import React from 'react'
import { Alert, View, StyleSheet } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { observer } from 'mobx-react'

import { validate as validateEmail } from 'email-validator'

import Login from '../../components/Login'

import AuthService from '../../services/AuthService'
import ModalAppBar from '../../components/ModalAppbar'

interface Props {
    route: {
        params: {
            onSuccess: () => unknown
        }
    }
}

// https://github.com/react-navigation/rfcs/issues/11
function goBackAsync(navigation) {
    const promise = new Promise((resolve) => {
        const unsubscribe = navigation.addListener('blur', () => {
            unsubscribe()
            resolve()
        })
    })
    navigation.goBack()
    return promise
}

const ReauthModal: React.FC<Props> = observer(({ route }: Props) => {
    const { onSuccess } = route.params
    const navigation = useNavigation()

    async function reauthUser(email: string, password: string) {
        if (!validateEmail(email)) {
            return
        }

        try {
            const result = await AuthService.reauthCurrentUser(email, password)

            if (!result) {
                Alert.alert('Error', 'User does not exist')
            }

            goBackAsync(navigation).then(onSuccess)
        } catch (error) {
            Alert.alert('Error', 'Username or password is incorrect')
        }
    }

    return (
        <View style={styles.root}>
            <ModalAppBar />
            <Login
                onSubmit={reauthUser}
                signInOnly
                caption="Please re-login to complete this action."
            />
        </View>
    )
})

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
})

export default ReauthModal
