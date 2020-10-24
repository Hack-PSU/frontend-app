import React from 'react'
import { StyleSheet, View, Alert, AlertType, ScrollView, Platform } from 'react-native'
import {
    Title,
    Avatar,
    Provider as PaperProvider,
    Surface,
    List,
    Button,
    Card,
} from 'react-native-paper'

import { useNavigation } from '@react-navigation/native'
import { useValueNotifier } from 'change-notifier'

import useForceUpdate from '../../hooks/useForceUpdate'

import AuthService from '../../data/AuthService'

import { BACKGROUND, RED, THEME } from '../../theme'
import ModalAppBar from '../../components/ModalAppbar'
import AndroidPrompt, { AndroidPromptData } from '../../components/AndroidPrompt'

const UserImage = require('../../../assets/images/user.png')

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: BACKGROUND,
    },

    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 36,
        paddingBottom: 16,
        paddingLeft: 24,
        paddingRight: 24,
        elevation: 4,
    },

    title: {
        fontFamily: 'Cornerstone',
        fontSize: 48,
        lineHeight: 52,
        color: '#113654',
    },

    expander: {
        flex: 1,
    },

    card: {
        margin: 8,
        paddingTop: 8,
        paddingBottom: 8,
    },

    button: {
        margin: 8,
        padding: 4,
    },
})

const ProfileModal: React.FC = () => {
    const forceUpdate = useForceUpdate()
    const navigation = useNavigation()
    const currentUser = useValueNotifier(AuthService)

    // Since Android doesn't have their own Alert/prompt system, we need to work around it using our own custom Dialog.
    const [isAndroidPromptVisible, setAndroidPromptVisible] = React.useState<boolean>(false)
    // When the dialog is visible, it'll show using these props. We need to initialize them now or it'll throw
    // undefined errors.
    const [androidPromptData, setAndroidPromptData] = React.useState<AndroidPromptData>({
        title: '',
        description: '',
        textLabel: '',
        updateFunc: () => {},
        type: 'default',
    })

    function prompt(
        title: string,
        androidTextInputLabel: string,
        description: string,
        updateFunc: (arg0: string) => unknown,
        type: AlertType
    ) {
        if (Platform.OS === 'ios') {
            Alert.prompt(title, description, updateFunc, type)
        } else if (Platform.OS === 'android') {
            setAndroidPromptData({
                title,
                textLabel: androidTextInputLabel,
                description,
                // Make a custom updateFunc to ensure the input isn't blank and that the prompt is set to be invisible
                // after the input.
                updateFunc: (arg: string) => {
                    if (arg) {
                        updateFunc(arg)
                    }
                    // Once the user is done with their changes, hide the prompt.
                    setAndroidPromptVisible(false)
                },
                type,
            })
            setAndroidPromptVisible(true)
        }
    }

    // We need to reauthenticate before preforming critical actions.
    function reauth() {
        return new Promise((resolve) => {
            navigation.navigate('Reauth', {
                onSuccess: resolve,
            })
        })
    }

    function onEditDisplayName() {
        prompt(
            'Edit display name',
            'Display Name',
            currentUser.displayName,
            (displayName) => {
                currentUser
                    .updateProfile({ displayName, photoURL: currentUser.photoURL })
                    .then(forceUpdate)
            },
            'default'
        )
    }

    async function onEditEmail() {
        await reauth()

        prompt(
            'Edit email',
            'Email',
            currentUser.email,
            (email) => {
                currentUser
                    .updateEmail(email)
                    .then(forceUpdate)
                    .catch((e) => {
                        Alert.alert('Error', e.toString())
                    })
            },
            'default'
        )
    }

    async function onEditPassword() {
        await reauth()

        prompt(
            'Edit password',
            'Password',
            null,
            (password) => {
                currentUser
                    .updatePassword(password)
                    .then(forceUpdate)
                    .catch((e) => {
                        Alert.alert('Error', e.toString())
                    })
            },
            'secure-text'
        )
    }

    // Deletes the user and pops back to login page.
    async function deleteAccount() {
        await reauth()

        Alert.alert(
            'Do you want to delete this account?',
            'Please proceed with caution. You cannot undo this action.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress() {
                        // Pop reauth dialog.
                        navigation.goBack()
                    },
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress() {
                        // This works because it is a stack navigator.
                        // https://reactnavigation.org/docs/navigation-prop/
                        ;(navigation as any).popToTop()
                        AuthService.deleteCurrentUser()
                    },
                },
            ]
        )
    }

    // Signs out the user and pops back to login page.
    function signOut() {
        AuthService.signOut()
        navigation.goBack()
    }

    return (
        <PaperProvider theme={THEME}>
            {/* No reason in rendering the android prompt when iOS doesn't need it. */}
            {Platform.OS === 'android' && (
                <AndroidPrompt
                    androidPromptData={androidPromptData}
                    visible={isAndroidPromptVisible}
                />
            )}

            <View style={styles.root}>
                <ModalAppBar />
                <ScrollView>
                    <Surface style={styles.container}>
                        <Title style={styles.title}>ACCOUNT</Title>
                        <View style={styles.expander} />
                        <Avatar.Image size={48} source={currentUser.photoURL || UserImage} />
                    </Surface>
                    <List.Section>
                        <Card style={styles.card}>
                            <List.Subheader>Edit account information</List.Subheader>
                            <List.Item
                                title="Display Name"
                                description={currentUser.displayName}
                                onPress={onEditDisplayName}
                            />
                            <List.Item
                                title="Email"
                                description={currentUser.email}
                                onPress={onEditEmail}
                            />
                            <List.Item
                                title="Password"
                                description="*********"
                                onPress={onEditPassword}
                            />
                        </Card>
                    </List.Section>
                    <Button
                        style={styles.button}
                        mode="contained"
                        color={RED}
                        onPress={deleteAccount}
                    >
                        Delete Account
                    </Button>
                    <Button style={styles.button} mode="contained" dark onPress={signOut}>
                        Sign Out
                    </Button>
                </ScrollView>
            </View>
        </PaperProvider>
    )
}

export default ProfileModal
