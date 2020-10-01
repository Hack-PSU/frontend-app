import React, { useState } from 'react'
import {
    StyleSheet,
    SafeAreaView,
    View,
    ActivityIndicator,
    StatusBar,
    ScrollView,
    Platform,
} from 'react-native'
import {
    TextInput,
    Button,
    Portal,
    Dialog,
    Title,
    Caption,
    FAB,
    DefaultTheme,
    Provider as PaperProvider,
} from 'react-native-paper'
import { useDimensions } from 'react-native-hooks'
import { observer } from 'mobx-react'

import { validate as validateEmail } from 'email-validator'

import BigLogo from './BigLogo'

import Mountain from '../../assets/images/mountain.svg'
import { fetchAsyncData, useAsyncData } from '../AsyncData'

export const SIGN_IN = 'Login'
export const REGISTER = 'Register'

export type Operation = 'Login' | 'Register'

interface Props {
    signInOnly?: boolean
    caption?: string
    onSubmit: (email: string, password: string, operation: Operation) => Promise<unknown>
}

const MOUNTAIN_WIDTH = 1920
const MOUNTAIN_HEIGHT = 810
const MOUNTAIN_ASPECT_RATIO = MOUNTAIN_HEIGHT / MOUNTAIN_WIDTH

const Login: React.FC<Props> = observer(({ signInOnly, caption, onSubmit }: Props) => {
    const { screen } = useDimensions()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // "Sign In" and "Register" are valid values.
    const [operation, setOperation] = useState<Operation>(SIGN_IN)

    const isValidEmail = validateEmail(email)

    const submitStatus = useAsyncData<boolean>()
    const submit = () => {
        fetchAsyncData(submitStatus, () => onSubmit(email, password, operation))
    }

    return (
        // Reset theme to follow something easier to work with for this screen
        <PaperProvider theme={loginTheme}>
            {/* Background color is Android only. */}
            <StatusBar
                backgroundColor={loginTheme.colors.statusBar}
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
            />

            {/* This dialog shows up after the user clicks the login/register button */}
            <Portal>
                <Dialog visible={submitStatus.loading}>
                    <Dialog.Content>
                        <ActivityIndicator animating={submitStatus.loading} size="large" />
                    </Dialog.Content>
                </Dialog>
            </Portal>

            <View style={styles.mountain}>
                <Mountain width={screen.width} height={screen.width * MOUNTAIN_ASPECT_RATIO} />
            </View>

            <ScrollView style={styles.root}>
                <SafeAreaView>
                    <BigLogo />
                    <Title style={styles.title}>{operation}</Title>
                    {caption && <Caption style={styles.caption}>{caption}</Caption>}

                    <TextInput
                        label="Email"
                        mode="flat"
                        style={styles.textInput}
                        autoCompleteType="email"
                        textContentType="emailAddress"
                        value={email}
                        error={email !== '' && !isValidEmail}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        label="Password"
                        mode="flat"
                        style={styles.textInput}
                        autoCompleteType="password"
                        textContentType="password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    {!signInOnly && (
                        <View style={styles.bottomButtonsContainer}>
                            <Button
                                compact={true}
                                uppercase={false}
                                color={loginTheme.colors.textButton}
                            >
                                Forgot password?
                            </Button>
                            <Button
                                onPress={() =>
                                    setOperation(operation === SIGN_IN ? REGISTER : SIGN_IN)
                                }
                                compact={true}
                                uppercase={false}
                                color={loginTheme.colors.textButton}
                            >
                                {operation === SIGN_IN ? 'Create account' : 'I have an account'}
                            </Button>
                        </View>
                    )}
                    <View style={styles.loginButtonContainer}>
                        <FAB
                            icon="send"
                            onPress={submit}
                            // disabled={!email || !isValidEmail || !password}
                            color={'white'}
                        >
                            {operation}
                        </FAB>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </PaperProvider>
    )
})

const loginTheme = {
    ...DefaultTheme,

    colors: {
        ...DefaultTheme.colors,
        primary: '#113654',
        accent: '#F3613D',
        statusBar: '#10253B',
        textButton: '#1ABCFE',
    },
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        paddingTop: 16,
        paddingHorizontal: 16,
    },

    title: {
        fontFamily: 'Cornerstone',
        fontSize: 48,
        color: loginTheme.colors.primary,
        paddingTop: 26,
    },

    textInput: {
        marginTop: 10,
    },

    caption: {
        lineHeight: 12,
    },

    loginButtonContainer: {
        height: 72,
        width: 72,
        alignSelf: 'flex-end',
        padding: 8,
        marginTop: 5,
        marginRight: 4,
    },

    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },

    bottomButtons: {
        fontSize: 5,
    },

    mountain: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
})

export default Login
