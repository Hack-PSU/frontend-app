import Constants from 'expo-constants'

/**
 * getEnvironment will try to get environment
 * variables specified in the "extra" section of "app.json"
 * (root directory of project).
 *
 * It will also determine automatically if we're running in dev,
 * staging, or prod mode (this is handled by Expo).
 *
 * IF DEV, try to return the following keys:
 * - name
 * - name.dev
 * - name.staging
 * IF STAGING, try to return the following keys:
 * - name.staging
 * IF PROD, try to return the following keys:
 * - name.prod
 */
function getEnvironment<T = any>(name: string): T | null {
    const env = Constants.manifest.releaseChannel
    const extra = Constants.manifest.extra

    // What is __DEV__ ?
    // This variable is set to true when react-native is running in Dev mode.
    // __DEV__ is true when run locally, but false when published.
    if (__DEV__) {
        if (extra[name]) {
            return extra[name]
        }

        if (extra[`${name}.dev`]) {
            return extra[`${name}.dev`]
        }

        // If we couldn't find dev, then try for staging.
        return extra[`${name}.staging`]
    } else if (env === 'staging') {
        return extra[`${name}.staging`]
    } else if (env === 'prod') {
        return extra[`${name}.prod`]
    }
}

export default getEnvironment
