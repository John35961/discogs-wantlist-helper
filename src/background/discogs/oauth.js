const DISCOGS_API_WRAPPER_BASE_URL = import.meta.env.VITE_DISCOGS_API_WRAPPER_BASE_URL;

const getRequestToken = async () => {
  const url = new URL(`${DISCOGS_API_WRAPPER_BASE_URL}/oauth/request_token`);
  url.searchParams.set('chromeRuntimeId', chrome.runtime.id);

  const res = await fetch(url, {
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

  const url = new URL(`${DISCOGS_API_WRAPPER_BASE_URL}/oauth/identity`);
  url.searchParams.set('accessToken', accessToken);
  url.searchParams.set('accessTokenSecret', accessTokenSecret);

  const res = await fetch(url, {
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
