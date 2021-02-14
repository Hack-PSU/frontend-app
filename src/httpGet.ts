import AsyncStorage from '@react-native-community/async-storage'

import type * as Firebase from 'firebase'

import getEnvironment from './getEnvironment'

// Gets the base urls for V1 API and V2 API.
// Also just copied this from frontend repo.
// const API_BASE_URL = getEnvironment('apiBaseUrl')
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

export interface HttpGetOptions {
    headers?: HeadersObj
}

export async function httpGet<T>(url: string, options: HttpGetOptions = {}): Promise<T> {
    const { headers = {} } = options

    const cacheKey = cacheKeyFunc(url, headers)
    const fullUrl = API_BASE_URL_V2.concat(url)

    console.log(`httpGet url: ${fullUrl}`)

    let res: Response
    try {
        res = await fetch(fullUrl, { headers })
    } catch (e) {
        // Last ditch effort to provide the user with data.
        const asyncValue = await AsyncStorage.getItem(cacheKey)
        if (asyncValue) {
            return JSON.parse(asyncValue) as T
        }

        throw e
    }

    const json: ApiResponse<ApiError | T> = await res.json()
    const data = json.body.data

    if (!res.ok) {
        throw data as ApiError
    }

    // Save to cache since we're successful.
    // Session storage first in case we fail to write to async.
    await AsyncStorage.setItem(cacheKey, JSON.stringify(data))

    return data as T
}

export async function httpGetWithAuth<T>(
    url: string,
    user: Firebase.User,
    options: HttpGetOptions = {}
): Promise<T> {
    const headers = user
        ? {
              ...(options.headers || {}),
              idtoken: await user.getIdToken(),
          }
        : options.headers

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
