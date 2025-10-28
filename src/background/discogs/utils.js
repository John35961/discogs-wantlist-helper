import CryptoJS from 'crypto-js';

const DISCOGS_API_WRAPPER_BASE_URL = import.meta.env.VITE_DISCOGS_API_WRAPPER_BASE_URL;
const TOKEN_ENCRYPTION_SECRET = import.meta.env.VITE_TOKEN_ENCRYPTION_SECRET;
const DISCOGS_RELEASE_REGEX = /discogs\.com\/release\/(\d+)/;
const FALLBACK_DISCOGS_RELEASE_REGEX = /www\.discogs\.com%2F.*release%2F(\d+)-/;

export const authenticatedFetch = async (path, options = {}) => {
  const stored = await chrome.storage.local.get(['jwtToken', 'refreshToken']);
  const jwtToken = stored.jwtToken;
  const refreshToken = stored.refreshToken;

  const res = await fetch(`${DISCOGS_API_WRAPPER_BASE_URL}${path}`, jwtReqOptions(jwtToken, options));

  if (res.status === 401) {
    const refreshResponse = await fetch(`${DISCOGS_API_WRAPPER_BASE_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!refreshResponse.ok) return refreshResponse;

    const data = await refreshResponse.json();
    const newJwtToken = data.jwtToken;

    await chrome.storage.local.set({ jwtToken: newJwtToken });

    return await fetch(`${DISCOGS_API_WRAPPER_BASE_URL}${path}`, jwtReqOptions(newJwtToken, options));
  };

  return res;
};

const jwtReqOptions = (jwtToken, options = {}) => {
  return {
    method: options.method,
    headers: {
      'authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options.body) || null,
  }
};

export const encryptToken = (token) => {
  return CryptoJS.AES.encrypt(token, TOKEN_ENCRYPTION_SECRET).toString();
};

export const decryptToken = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, TOKEN_ENCRYPTION_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const parseReleaseId = (input) => {
  if (!input) return null;

  if (/^\d+$/.test(input)) return input;

  const match = input.match(DISCOGS_RELEASE_REGEX);
  if (match && match[1]) return match[1];

  let result = match && match[1] ? match[1] : null;

  const fallbackMatch = input.match(FALLBACK_DISCOGS_RELEASE_REGEX);
  result ??= fallbackMatch && fallbackMatch[1] ? fallbackMatch[1] : null;

  if (!result) {
    throw new Error('Must be a valid Discogs URL');
  };

  return result;
};
