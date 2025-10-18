import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js';
import { CONSUMER_KEY, CONSUMER_SECRET } from './consts.js';

const oauth = OAuth({
  consumer: {
    key: CONSUMER_KEY,
    secret: CONSUMER_SECRET
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
  }
});

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

const getIdentity = async () => {
  const stored = await chrome.storage.local.get(['accessToken', 'accessTokenSecret']);
  const accessToken = stored.accessToken;
  const accessTokenSecret = stored.accessTokenSecret;

  const requestData = {
    url: 'https://api.discogs.com/oauth/identity',
    method: 'GET'
  };

  if (!accessToken || !accessTokenSecret) {
    return;
  };

  const tokens = {
    key: accessToken,
    secret: accessTokenSecret
  };

  const headers = oauth.toHeader(oauth.authorize(requestData, tokens));

  const res = await fetch(requestData.url, {
    method: requestData.method,
    headers: headers
  })

  if (!res.ok) {
    throw new Error('Error fetching identity');
  }

  const data = await res.json();

  await chrome.storage.local.set({ username: data.username });

  return data;
}

const addToWantlist = async (releaseId) => {
  const stored = await chrome.storage.local.get(['accessToken', 'accessTokenSecret', 'username']);
  const accessToken = stored.accessToken;
  const accessTokenSecret = stored.accessTokenSecret;
  const username = stored.username

  const requestData = {
    url: `https://api.discogs.com/users/${username}/wants/${releaseId}`,
    method: 'PUT'
  };

  const tokens = {
    key: accessToken,
    secret: accessTokenSecret
  };

  const headers = oauth.toHeader(oauth.authorize(requestData, tokens));

  const res = await fetch(requestData.url, {
    method: requestData.method,
    headers: headers,
    credentials: 'omit',
  });

  if (!res.ok) {
    throw new Error('Error adding to wantlist');
  };

  const data = await res.json();

  return data;
};

export { getUser, getIdentity, addToWantlist };
