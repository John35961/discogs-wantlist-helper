import { headersFrom, generateNonce } from './utils.js';
import { CONSUMER_KEY, CONSUMER_SECRET } from './consts.js';

const DISCOGS_API_WRAPPER_BASE_URL = import.meta.env.VITE_DISCOGS_API_WRAPPER_BASE_URL;

const getRequestToken = async () => {
  const res = await fetch(`${DISCOGS_API_WRAPPER_BASE_URL}/oauth/request_token`, {
    method: 'GET'
  })

  if (!res.ok) {
    throw new Error(res.error);
  }

  const data = await res.json();

  return data;
};

const getAccessToken = async (requestToken, requestTokenSecret, oauthVerifier) => {
  const authParams = {
    oauth_consumer_key: CONSUMER_KEY,
    oauth_token: requestToken,
    oauth_signature_method: 'PLAINTEXT',
    oauth_signature: `${CONSUMER_SECRET}&${requestTokenSecret}`,
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_nonce: generateNonce(),
    oauth_verifier: oauthVerifier,
    oauth_version: '1.0'
  };

  const res = await fetch("https://api.discogs.com/oauth/access_token", {
    method: 'POST',
    headers: {
      'Authorization': `OAuth ${headersFrom(authParams)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  if (!res.ok) {
    throw new Error('Error fetching access token');
  }

  const text = await res.text();
  const params = new URLSearchParams(text)
  const accessToken = params.get("oauth_token");
  const accessTokenSecret = params.get("oauth_token_secret");

  if (!accessToken || !accessTokenSecret) {
    throw new Error("Failed to retrieve access token or access token secret");
  }

  await chrome.storage.local.set({ accessToken, accessTokenSecret });
  return { accessToken, accessTokenSecret };
}

export { getRequestToken, getAccessToken }
