import { encryptToken, decryptToken } from "./utils.js";

const DISCOGS_API_WRAPPER_BASE_URL = import.meta.env.VITE_DISCOGS_API_WRAPPER_BASE_URL;

export const getRequestToken = async () => {
  const url = new URL(`${DISCOGS_API_WRAPPER_BASE_URL}/oauth/request_token`);
  url.searchParams.set('chromeRuntimeId', chrome.runtime.id);

  const res = await fetch(url, {
    method: 'GET'
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const getAccessToken = async (requestToken, requestTokenSecret, oauthVerifier) => {
  const res = await fetch(`${DISCOGS_API_WRAPPER_BASE_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requestToken: requestToken,
      requestTokenSecret: requestTokenSecret,
      oauthVerifier: oauthVerifier,
    })
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  const { accessToken, accessTokenSecret, jwtToken, refreshToken } = data;
  const accessTokens = {
    accessToken: encryptToken(accessToken),
    accessTokenSecret: encryptToken(accessTokenSecret),
    jwtToken: jwtToken,
    refreshToken: refreshToken,
  };
  await chrome.storage.local.set({ ...accessTokens });

  return { accessToken, accessTokenSecret };
};

export const getIdentity = async () => {
  const stored = await chrome.storage.local.get(['accessToken', 'accessTokenSecret']);
  const accessToken = decryptToken(stored.accessToken);
  const accessTokenSecret = decryptToken(stored.accessTokenSecret);

  if (!accessToken || !accessTokenSecret) {
    return;
  };

  const url = new URL(`${DISCOGS_API_WRAPPER_BASE_URL}/oauth/identity`);
  url.searchParams.set('accessToken', accessToken);
  url.searchParams.set('accessTokenSecret', accessTokenSecret);

  const res = await fetch(url, {
    method: 'GET'
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  await chrome.storage.local.set({ username: data.username });

  return data;
};
