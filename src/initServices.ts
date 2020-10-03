import * as Firebase from 'firebase'

import AuthService from './data/AuthService'
import getEnvironment from './getEnvironment'

let hasInit = false

/**
 * Initializes all services.
 */
export default function initServices() {
    if (hasInit) {
        return
    }

    hasInit = true

    // "firebase" key gets params for firebase.initializeApp
    // https://docs.expo.io/versions/latest/guides/using-firebase/#user-authentication
    Firebase.initializeApp(getEnvironment('firebase'))

    AuthService.init()
}
