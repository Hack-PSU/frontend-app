import React, { useEffect, useMemo, useState } from 'react'
import {
    StyleSheet,
    SafeAreaView,
    View,
    ActivityIndicator,
    StatusBar,
    ScrollView,
    Platform,
    Linking,
    Text,
} from 'react-native'
import {
    TextInput,
    Button,
    Portal,
    Dialog,
    Caption,
    FAB,
    DefaultTheme,
    Provider as PaperProvider,
} from 'react-native-paper'
import { useDimensions } from 'react-native-hooks'

import Animated from 'react-native-reanimated'
import { useTimingTransition, interpolateColor } from 'react-native-redash'

import {
    AppleAuthenticationButton,
    AppleAuthenticationButtonType,
    AppleAuthenticationButtonStyle,
} from 'expo-apple-authentication'
import { AntDesign } from '@expo/vector-icons'

import { validate as validateEmail } from 'email-validator'

import BigLogo from './BigLogo'

import Mountain from '../../assets/images/mountain.svg'
import AuthService from '../data/AuthService'

export const SIGN_IN = 'Login'
export const SIGN_UP = 'Sign Up'

export type Operation = 'Login' | 'Sign Up'

interface Props {
    signInOnly?: boolean
    caption?: string
    onSubmit: (email: string, password: string, operation: Operation) => Promise<unknown>
}

const MOUNTAIN_WIDTH = 1920
const MOUNTAIN_HEIGHT = 810
const MOUNTAIN_ASPECT_RATIO = MOUNTAIN_HEIGHT / MOUNTAIN_WIDTH

const Login: React.FC<Props> = ({ signInOnly, caption, onSubmit }: Props) => {
    const { screen } = useDimensions()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // "Sign In" and "Sign Up" are valid values.
    const [operation, setOperation] = useState<Operation>(SIGN_IN)
    const isSignIn = operation === SIGN_IN

    const isSignInAnimated = useTimingTransition(isSignIn, { duration: 100 })

    const isValidEmail = validateEmail(email)

    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const submit = () => {
        setSubmitLoading(true)
    }

    useEffect(() => {
        let disposed = false

        if (submitLoading) {
            onSubmit(email, password, operation).finally(() => {
                if (!disposed) {
                    setSubmitLoading(false)
                }
            })
        }

        return () => (disposed = true)
    }, [submitLoading, onSubmit, email, password, operation])

    const [bgColorStyle, titleStyle] = useMemo(() => {
        return [
            {
                // Makes heavy use of interpolateColor:
                // https://github.com/wcandillon/react-native-redash/blob/af87fea6363c2bbaae1ab56c305dd0eea533f97d/src/Colors.ts#L205
                backgroundColor: interpolateColor(isSignInAnimated, {
                    inputRange: [0, 1],
                    outputRange: [LOGIN_THEME.colors.primary, '#FFFFFF'],
                }),
            },
            {
                color: isSignIn ? LOGIN_THEME.colors.primary : 'white',
            },
        ]
    }, [isSignIn, isSignInAnimated])

    return (
        // Reset theme to follow something easier to work with for this screen
        <PaperProvider theme={LOGIN_THEME}>
            {/* Background color is Android only. */}
            <StatusBar
                backgroundColor={LOGIN_THEME.colors.statusBar}
                barStyle={
                    Platform.OS === 'ios'
                        ? isSignIn
                            ? 'dark-content'
                            : 'light-content'
                        : 'light-content'
                }
            />

            {/* This dialog shows up after the user clicks the login/signup button */}
            <Portal>
                <Dialog visible={submitLoading}>
                    <Dialog.Content>
                        <ActivityIndicator animating={submitLoading} size="large" />
                    </Dialog.Content>
                </Dialog>
            </Portal>

            {/* Wrapped all this with a view so the background color will be visible behind the SVG. If
                operationColors.bgColor were in the ScrollView, it would render over the Mountain and wouldn't be 
                visible to the user */}
            <Animated.View style={bgColorStyle}>
                <View style={styles.mountain}>
                    <Mountain width={screen.width} height={screen.width * MOUNTAIN_ASPECT_RATIO} />
                </View>
                <ScrollView style={styles.root}>
                    <SafeAreaView>
                        <BigLogo elevation={isSignIn ? 0 : 8} />
                        <Text style={[styles.title, titleStyle]}>{operation}</Text>
                        {caption && <Caption style={styles.caption}>{caption}</Caption>}

                        <TextInput
                            label="Email"
                            mode="flat"
                            dense
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
                            dense
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
                                    onPress={() => {
                                        Linking.openURL('https://app.hackpsu.org/forgot')
                                    }}
                                    compact={true}
                                    uppercase={false}
                                    color={LOGIN_THEME.colors.textButton}
                                >
                                    Forgot password?
                                </Button>
                                <Button
                                    onPress={() => setOperation(isSignIn ? SIGN_UP : SIGN_IN)}
                                    compact={true}
                                    uppercase={false}
                                    color={LOGIN_THEME.colors.textButton}
                                >
                                    {isSignIn ? 'Create account' : 'I have an account'}
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
                        <View style={styles.socialContainer}>
                            <Button
                                icon={({ size, color }) => (
                                    <AntDesign name="google" size={size} color={color} />
                                )}
                                mode="contained"
                                color={GOOGLE}
                                dark
                                onPress={AuthService.signInWithGoogle}
                                style={styles.socialButton}
                                contentStyle={styles.socialButtonInner}
                                labelStyle={styles.socialButtonLabel}
                            >
                                Sign In with Google
                            </Button>
                            <Button
                                icon={({ size, color }) => (
                                    <AntDesign name="github" size={size} color={color} />
                                )}
                                mode="contained"
                                color={isSignIn ? GITHUB : GITHUB_LIGHT}
                                onPress={AuthService.signInWithGithub}
                                style={styles.socialButton}
                                contentStyle={styles.socialButtonInner}
                                labelStyle={styles.socialButtonLabel}
                            >
                                Sign In with GitHub
                            </Button>
                            {Platform.OS === 'ios' && (
                                <AppleAuthenticationButton
                                    buttonType={
                                        isSignIn
                                            ? AppleAuthenticationButtonType.SIGN_IN
                                            : AppleAuthenticationButtonType.SIGN_UP
                                    }
                                    buttonStyle={
                                        isSignIn
                                            ? AppleAuthenticationButtonStyle.BLACK
                                            : AppleAuthenticationButtonStyle.WHITE
                                    }
                                    cornerRadius={4}
                                    style={styles.appleButton}
                                    onPress={AuthService.signInWithApple}
                                />
                            )}
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </Animated.View>
        </PaperProvider>
    )
}

const GOOGLE = '#4C8BF5'
const GITHUB = 'rgb(26,29,32)'
const GITHUB_LIGHT = 'rgb(30,125,255)'

const LOGIN_THEME = {
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
        color: LOGIN_THEME.colors.primary,
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

    socialContainer: {
        padding: 8,
    },

    socialButton: {
        marginTop: 8,
    },

    socialButtonInner: {
        height: 40,
    },

    socialButtonLabel: {
        fontWeight: '600',
        textTransform: 'none',
        fontSize: 15,
        letterSpacing: 0,
    },

    appleButton: {
        marginTop: 8,
        height: 40,
    },

    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },

    mountain: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
})

export default Login
