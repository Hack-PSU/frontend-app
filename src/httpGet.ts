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

export async function httpGet<T>(
  url: string,
  v2: boolean = true,
  headers?: Headers
): Promise<T> {
  const fullUrl = v2 ? API_BASE_URL_V2.concat(url) : API_BASE_URL.concat(url);

  const res = await fetchRetry(fullUrl, { headers });

  if (v2) {
    const json: ApiResponse<ApiError | T> = await res.json();
    const data = json.body.data;

    if (!res.ok) {
      console.warn(`${url} (${res.status}): ${(data as ApiError).message}`);
    }

    return data as T;
  } else {
    const json: T = await res.json();

    if (!res.ok) {
      console.warn(`${url} (${res.status}): ${res.statusText}`);
    }

    return json as T;
  }
}

export async function httpGetWithAuth<T>(
  url: string,
  user: Firebase.User,
  v2: boolean = true
): Promise<T> {
  const headers = new Headers({
    idtoken: await user.getIdToken()
  });

  return httpGet<T>(url, v2, headers);
}
