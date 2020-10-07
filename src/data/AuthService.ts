import * as Firebase from 'firebase'
import { ValueNotifier } from 'change-notifier'

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
