import { decryptToken } from "./utils.js";

const DISCOGS_API_WRAPPER_BASE_URL = import.meta.env.VITE_DISCOGS_API_WRAPPER_BASE_URL;

export const getUser = async (username) => {
  const requestData = {
    url: `${DISCOGS_API_WRAPPER_BASE_URL}/users/${username}`,
    method: 'GET'
  };

  const res = await fetch(requestData.url, {
    method: requestData.method,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const addToWantlist = async (releaseId) => {
  const stored = await chrome.storage.local.get(['accessToken', 'accessTokenSecret', 'username']);
  const accessToken = decryptToken(stored.accessToken);
  const accessTokenSecret = decryptToken(stored.accessTokenSecret);
  const userName = stored.username;

  const requestData = {
    url: `${DISCOGS_API_WRAPPER_BASE_URL}/users/${userName}/wants/${releaseId}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accessToken: accessToken,
      accessTokenSecret: accessTokenSecret,
    })
  };

  const res = await fetch(requestData.url, {
    method: requestData.method,
    headers: requestData.headers,
    body: requestData.body,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};
