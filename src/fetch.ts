import * as Firebase from "firebase";

import createFetchRetry from "@zeit/fetch-retry";

import getEnv from "./getEnv";

const API_BASE_URL = getEnv("apiBaseUrl");
const API_BASE_URL_V2 = getEnv("apiBaseUrlV2");

function handleV1(json) {
  console.log(json);
  return json;
}

function handleV2(json) {
  if (json.api_response === "Success") {
    return json.body.data;
  }

  // TODO: Error handling.
  return null;
}

// Wrap "browser" (React Native) fetch in our fetch retry.
const browserFetch = window.fetch;
const fetchRetry: (typeof browserFetch) = createFetchRetry(browserFetch);

export async function fetch<T>(url: string, v2: boolean = false): Promise<T> {
  const fullUrl = v2 ? API_BASE_URL_V2.concat(url) : API_BASE_URL.concat(url)

  const res = await fetchRetry(fullUrl);
  const json = await res.json();

  if (v2) {
    return handleV2(json);
  }

  return handleV1(json);
}

export async function fetchWithAuth<T>(url: string, user: Firebase.User, v2: boolean = false): Promise<T> {
  const headers = new Headers({
    idtoken: await user.getIdToken()
  });

  const fullUrl = v2 ? API_BASE_URL_V2.concat(url) : API_BASE_URL.concat(url)

  const res = await fetchRetry(fullUrl, { headers });
  const json = await res.json();

  if (v2) {
    return handleV2(json);
  }

  return handleV1(json);
}
