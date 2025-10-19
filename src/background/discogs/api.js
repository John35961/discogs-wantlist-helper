const DISCOGS_API_WRAPPER_BASE_URL = import.meta.env.VITE_DISCOGS_API_WRAPPER_BASE_URL;

const getUser = async (username) => {
  const requestData = {
    url: `${DISCOGS_API_WRAPPER_BASE_URL}/users/${username}`,
    method: 'GET'
  };

  const res = await fetch(requestData.url, {
    method: requestData.method,
  });

  if (!res.ok) {
    throw new Error(res.error);
  };

  const data = await res.json();

  return data;
};

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

  if (!res.ok) {
    throw new Error(res.error);
  };

  const data = await res.json();

  return data;
};

export { getUser, addToWantlist };
