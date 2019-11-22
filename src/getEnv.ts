import Constants from "expo-constants";

function getEnv(name) {
  const env = Constants.manifest.releaseChannel;
  const extra = Constants.manifest.extra;

  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  if (__DEV__) {
    if (extra[name]) {
      return extra[name];
    }

    if (extra[`${name}.dev`]) {
      return extra[`${name}.dev`];
    }

    // If we couldn't find dev, then try for staging.
    return extra[`${name}.staging`];
  } else if (env === "staging") {
    return extra[`${name}.staging`];
  } else if (env === "prod") {
    return extra[`${name}.prod`];
  }
}

export default getEnv;

// Gets params for firebase.initializeApp
// https://docs.expo.io/versions/latest/guides/using-firebase/#user-authentication
export function getFirebaseEnv() {
  return getEnv("firebase");  
}
