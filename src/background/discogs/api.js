const DISCOGS_API_WRAPPER_BASE_URL = import.meta.env.VITE_DISCOGS_API_WRAPPER_BASE_URL;

const getUser = async (username) => {
  const requestData = {
    url: `${DISCOGS_API_WRAPPER_BASE_URL}/users/${username}`,
    method: 'GET'
  };

  const res = await fetch(requestData.url, {
    method: requestData.method,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  };

  return data;
};

const searchForReleases = async (query) => {
  const stored = await chrome.storage.local.get(['accessToken', 'accessTokenSecret']);
  const accessToken = stored.accessToken;
  const accessTokenSecret = stored.accessTokenSecret;

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
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  };

  return data;
}

const addToWantlist = async (releaseId) => {
  const stored = await chrome.storage.local.get(['accessToken', 'accessTokenSecret', 'username']);
  const accessToken = stored.accessToken;
  const accessTokenSecret = stored.accessTokenSecret;
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

  if (!res.ok) {
    throw new Error(data.error);
  };

  return data;
};

export { getUser, searchForReleases, addToWantlist };
