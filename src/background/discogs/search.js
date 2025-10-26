import { decryptToken } from "./utils.js";

const DISCOGS_API_WRAPPER_BASE_URL = import.meta.env.VITE_DISCOGS_API_WRAPPER_BASE_URL;

export const searchDatabase = async (query) => {
  const stored = await chrome.storage.local.get(['accessToken', 'accessTokenSecret', 'jwtToken']);
  const accessToken = decryptToken(stored.accessToken);
  const accessTokenSecret = decryptToken(stored.accessTokenSecret);

  const url = new URL(`${DISCOGS_API_WRAPPER_BASE_URL}/database/search`);
  url.searchParams.set('accessToken', accessToken);
  url.searchParams.set('accessTokenSecret', accessTokenSecret);
  url.searchParams.set('q', encodeURIComponent(query));

  const requestData = {
    url: url,
    method: 'GET'
  };

  const res = await fetch(requestData.url, {
    method: requestData.method,
    headers: {
      'authorization': `Bearer ${stored.jwtToken}`,
    }
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};
