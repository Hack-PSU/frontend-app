import { AsyncStorage } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import * as Firebase from "firebase";
import createFetchRetry from "@zeit/fetch-retry";

import getEnvironment from "./getEnvironment";

// Gets the base urls for V1 API and V2 API.
// Also just copied this from frontend repo.
const API_BASE_URL = getEnvironment("apiBaseUrl");
const API_BASE_URL_V2 = getEnvironment("apiBaseUrlV2");

export interface ApiResponse<T> {
  api_response: string;
  status: number;
  body: { data: T; result: string };
}

export interface ApiError {
  error: any;
  message: string;
}

// Wrap "browser" (React Native) fetch in our fetch retry.
const browserFetch = window.fetch;
const fetchRetry: typeof browserFetch = createFetchRetry(browserFetch);

function createUniqueCacheKey(url: string, headers?: Headers) {
  let key = `@HackPSU:httpGet:${url}`;

  // We have to cast headers to 'any' because the TS types
  // aren't complete for this.
  for (const { name, value } of (<any>headers).entries()) {
    key += `\n${name}\n${value}`;
  }

  return key;
}

const SESSION_STORAGE = new Map<string, unknown>();

export async function httpGet<T>(
  url: string,
  v2: boolean = true,
  headers?: Headers,
  cache: boolean = true
): Promise<T> {
  const cacheKey = createUniqueCacheKey(url, headers);
  const fullUrl = v2 ? API_BASE_URL_V2.concat(url) : API_BASE_URL.concat(url);

  console.log(`debug url: ${fullUrl}`);

  /**
   * How cache works:
   *
   * 1) Check session storage, return if true.
   * 2) If offline, check async storage.
   * 3) Try to fetch from server
   *    a) If (3) failed, check async storage.
   */
  if (cache) {
    // If in session storage return immediately.
    if (SESSION_STORAGE.has(cacheKey)) {
      return SESSION_STORAGE.get(cacheKey) as T;
    }

    // const { isConnected } = await NetInfo.fetch();

    // if (!isConnected) {
    //   const asyncValue = await AsyncStorage.getItem(cacheKey);
    //   if (asyncValue) {
    //     return JSON.parse(asyncValue) as T;
    //   }
    // }
  }

  let res;
  try {
    res = await fetchRetry(fullUrl, { headers });
  } catch (e) {
    if (cache) {
      // Last ditch effort to provide the user with data.
      const asyncValue = await AsyncStorage.getItem(cacheKey);
      if (asyncValue) {
        return JSON.parse(asyncValue) as T;
      }
    }

    throw e;
  }

  if (v2) {
    const json: ApiResponse<ApiError | T> = await res.json();
    const data = json.body.data;

    if (!res.ok) {
      throw data as ApiError;
    }

    // Save to cache since we're successful.
    // Session storage first in case we fail to write to async.
    if (cache) {
      SESSION_STORAGE.set(cacheKey, data);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
    }

    return data as T;
  } else {
    const json: T = await res.json();

    if (!res.ok) {
      throw {
        error: res.status,
        message: res.statusText
      };
    }

    // Save to cache since we're successful.
    // Session storage first in case we fail to write to async.
    if (cache) {
      SESSION_STORAGE.set(cacheKey, json);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(json));
    }

    return json as T;
  }
}

export async function httpGetWithAuth<T>(
  url: string,
  user: Firebase.User,
  v2: boolean = true,
  cache: boolean = true
): Promise<T> {
  const headers = new Headers({
    idtoken: await user.getIdToken()
  });

  return httpGet<T>(url, v2, headers, cache);
}
