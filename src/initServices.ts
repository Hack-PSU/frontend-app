import * as Firebase from "firebase";

import AuthService from "./services/AuthService";
import getEnvironment from "./getEnvironment";

/**
 * Initializes all services.
 */
export default function initServices() {
  // "firebase" key gets params for firebase.initializeApp
  // https://docs.expo.io/versions/latest/guides/using-firebase/#user-authentication
  Firebase.initializeApp(getEnvironment("firebase"));

  AuthService.init();
}
