/* eslint-disable no-magic-numbers */
import * as Firebase from 'firebase'
import * as Google from 'expo-google-app-auth'
import * as AppAuth from 'expo-app-auth'
import * as AppleAuthentication from 'expo-apple-authentication'

import sha from 'sha.js'
import { ValueNotifier } from 'change-notifier'

import getEnvironment from '../getEnvironment'

const GOOGLE_CONFIG = {
    iosClientId: getEnvironment('googleSignInIOS'),
    androidClientId: getEnvironment('googleSignInAndroid'),
}

const GITHUB_CONFIG: AppAuth.OAuthProps = {
    issuer: 'https://github.com/login/oauth',
    scopes: ['user'],
    clientId: '6b7513e1d106b482ab73',
    clientSecret: '12ad032c5275c719fb40fba6803e5bf18f5006dc',
    serviceConfiguration: {
        authorizationEndpoint: 'https://github.com/login/oauth/authorize',
        tokenEndpoint: 'https://github.com/login/oauth/access_token',
        revocationEndpoint: 'https://github.com/settings/connections/applications/<CLIENT_ID>',
    },
}

// I pretty much stole & refactored auth.service.ts from the frontend repo.

// TODO: Sign in with Google, GitHub, and Apple on iOS
// eslint-disable-next-line no-shadow
export enum AuthProviders {
    GOOGLE_PROVIDER,
    GITHUB_PROVIDER,
    APPLE_PROVIDER,
}

export class AuthService extends ValueNotifier<Firebase.User | null> {
    get isLoggedIn() {
        return this.value != null
    }

    constructor() {
        super(null)
    }

    init() {
        Firebase.auth().onAuthStateChanged((user) => {
            // eslint-disable-next-line no-console
            console.log('auth state changed')
            this.value = user
        })

        this.value = Firebase.auth().currentUser
    }

    signIn(email: string, password: string) {
        return Firebase.auth().signInWithEmailAndPassword(email, password)
    }

    signOut() {
        return Firebase.auth().signOut()
    }

    createUser(email: string, password: string) {
        return Firebase.auth().createUserWithEmailAndPassword(email, password)
    }

    reauthCurrentUser(email: string, password: string) {
        const { value } = this

        if (!value) {
            return
        }

        const cred = Firebase.auth.EmailAuthProvider.credential(email, password)

        return value.reauthenticateWithCredential(cred)
    }

    deleteCurrentUser() {
        const { value } = this

        if (!value) {
            return
        }
        value.delete()
    }

    async signInWithGoogle(): Promise<unknown> {
        const res = await Google.logInAsync(GOOGLE_CONFIG)
        if (res.type === 'cancel') {
            return
        }

        const { idToken, accessToken } = res
        const cred = Firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)

        return Firebase.auth().signInWithCredential(cred)
    }

    async signInWithGithub(): Promise<unknown> {
        const { accessToken } = await AppAuth.authAsync(GITHUB_CONFIG)

        const cred = Firebase.auth.GithubAuthProvider.credential(accessToken)
        return Firebase.auth().signInWithCredential(cred)
    }

    // TODO: Not complete.
    // https://medium.com/@dansinger_68758/adding-sign-in-with-apple-to-a-managed-expo-app-using-firebase-authentication-ca331b4de05
    async signInWithApple(): Promise<unknown> {
        // TODO: Probably use something cryptographically secure?
        const nonce = Math.random().toString(36).substring(2, 10)
        const hashedNonce = sha('sha256').update(nonce).digest('hex')

        try {
            const { identityToken: idToken } = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
                nonce: hashedNonce,
            })

            if (idToken) {
                return
            }

            const provider = new Firebase.auth.OAuthProvider('apple.com')
            provider.addScope('email')
            provider.addScope('name')

            const cred = provider.credential({
                idToken,
                rawNonce: nonce,
            })

            return Firebase.auth().signInWithCredential(cred)
        } catch (e) {
            console.log(e)
            return
        }
    }

    // signInWithProvider(provider: AuthProviders): Promise<any> {
    //   let authProvider: firebase.auth.AuthProvider = null;
    //   switch (provider) {
    //     case AuthProviders.GOOGLE_PROVIDER:
    //       authProvider = new firebase.auth.GoogleAuthProvider();
    //       break;
    //     case AuthProviders.GITHUB_PROVIDER:
    //       authProvider = new firebase.auth.GithubAuthProvider();
    //       break;
    //   }
    //   return this.afAuth.auth.signInWithPopup(authProvider);
    // }
}

const singleton = new AuthService()
export default singleton
