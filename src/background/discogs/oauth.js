const DISCOGS_API_WRAPPER_BASE_URL = import.meta.env.VITE_DISCOGS_API_WRAPPER_BASE_URL;

const getRequestToken = async () => {
  const res = await fetch(`${DISCOGS_API_WRAPPER_BASE_URL}/oauth/request_token`, {
    method: 'GET'
  });

  if (!res.ok) {
    throw new Error(res.error);
  };

  const data = await res.json();

  return data;
};

const getAccessToken = async (requestToken, requestTokenSecret, oauthVerifier) => {
  const res = await fetch(`${DISCOGS_API_WRAPPER_BASE_URL}/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requestToken: requestToken,
      requestTokenSecret: requestTokenSecret,
      oauthVerifier: oauthVerifier,
    })
  });

  if (!res.ok) {
    throw new Error(res.error);
  };

  const data = await res.json();
  const { accessToken, accessTokenSecret } = data;
  await chrome.storage.local.set({ accessToken, accessTokenSecret });

  return { accessToken, accessTokenSecret };
};

const getIdentity = async () => {
  const stored = await chrome.storage.local.get(['accessToken', 'accessTokenSecret']);
  const accessToken = stored.accessToken;
  const accessTokenSecret = stored.accessTokenSecret;

  if (!accessToken || !accessTokenSecret) {
    return;
  };

  const res = await fetch(`${DISCOGS_API_WRAPPER_BASE_URL}/oauth/identity?accessToken=${accessToken}&accessTokenSecret=${accessTokenSecret}`, {
    method: 'GET'
  });

  if (!res.ok) {
    throw new Error(res.error);
  };

  const data = await res.json();

  await chrome.storage.local.set({ username: data.username });

  return data;
};

export { getRequestToken, getAccessToken, getIdentity }
