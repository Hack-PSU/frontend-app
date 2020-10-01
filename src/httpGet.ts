import { AsyncStorage } from 'react-native'

import * as Firebase from 'firebase'
import createFetchRetry from '@zeit/fetch-retry'

import getEnvironment from './getEnvironment'
import sessionStorage from './sessionStorage'

// Gets the base urls for V1 API and V2 API.
// Also just copied this from frontend repo.
const API_BASE_URL = getEnvironment('apiBaseUrl')
const API_BASE_URL_V2 = getEnvironment('apiBaseUrlV2')

export interface ApiResponse<T> {
    api_response: string
    status: number
    body: { data: T; result: string }
}

export interface ApiError {
    error: any
    message: string
}

export type HeadersObj = { [key: string]: string }

// Wrap "browser" (React Native) fetch in our fetch retry.
const fetchRetry: typeof window.fetch = createFetchRetry(window.fetch)

export interface HttpGetOptions {
    v2?: boolean
    cache?: boolean
    // If force is true, ignore cache at the beginning but still (optionally) write to it.
    force?: boolean
    headers?: HeadersObj
}

export async function httpGet<T>(url: string, options: HttpGetOptions = {}): Promise<T> {
    const { v2 = true, cache = true, force = false, headers = {} } = options

    const cacheKey = cacheKeyFunc(url, headers)
    const fullUrl = v2 ? API_BASE_URL_V2.concat(url) : API_BASE_URL.concat(url)

    console.log(`httpGet url: ${fullUrl}`)

    /**
     * How cache works:
     *
     * 1) Check session storage, return if true.
     * 2) Try to fetch from server
     *    a) If (2) failed, check async storage.
     */
    if (cache && !force) {
        // If in session storage return immediately.
        if (sessionStorage[cacheKey]) {
            return sessionStorage[cacheKey] as T
        }
    }

    let res
    try {
        res = await fetchRetry(fullUrl, { headers })
    } catch (e) {
        if (cache) {
            // Last ditch effort to provide the user with data.
            const asyncValue = await AsyncStorage.getItem(cacheKey)
            if (asyncValue) {
                return JSON.parse(asyncValue) as T
            }
        }

        throw e
    }

    if (v2) {
        const json: ApiResponse<ApiError | T> = await res.json()
        const data = json.body.data

        if (!res.ok) {
            throw data as ApiError
        }

        // Save to cache since we're successful.
        // Session storage first in case we fail to write to async.
        if (cache) {
            sessionStorage[cacheKey] = data
            await AsyncStorage.setItem(cacheKey, JSON.stringify(data))
        }

        return data as T
    } else {
        const json: T = await res.json()

        if (!res.ok) {
            throw {
                error: res.status,
                message: res.statusText,
            }
        }

        // Save to cache since we're successful.
        // Session storage first in case we fail to write to async.
        if (cache) {
            sessionStorage[cacheKey] = json
            await AsyncStorage.setItem(cacheKey, JSON.stringify(json))
        }

        return json as T
    }
}

export async function httpGetWithAuth<T>(
    url: string,
    user: Firebase.User,
    options: HttpGetOptions = {}
): Promise<T> {
    const headers = {
        ...(options.headers || {}),
        idtoken: await user.getIdToken(),
    }

    return httpGet<T>(url, {
        ...options,
        headers,
    })
}

/**
 * Creates a unique key for the given httpGet request.
 */
function cacheKeyFunc(url: string, headers?: HeadersObj): string {
    let key = `@HackPSU:httpGet:${url}`

    if (!headers) {
        return key
    }

    // We have to cast headers to 'any' because the TS types
    // aren't complete for this.
    for (const [name, value] of Object.entries(headers)) {
        key += `\n${name}\n${value}`
    }

    return key
}
