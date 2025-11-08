import { authenticatedFetch, decryptToken } from './utils.js';

export const getUser = async (username) => {
  const res = await authenticatedFetch(`/users/${username}`, { method: 'GET' });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const addToWantlist = async (releaseId) => {
  const stored = await chrome.storage.local.get(['accessToken', 'accessTokenSecret', 'jwtToken', 'username']);
  const accessToken = decryptToken(stored.accessToken);
  const accessTokenSecret = decryptToken(stored.accessTokenSecret);
  const userName = stored.username;

  const res = await authenticatedFetch(`/users/${userName}/wants/${releaseId}`, {
    method: 'PUT',
    body: {
      accessToken: accessToken,
      accessTokenSecret: accessTokenSecret,
    }
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const removeFromWantlist = async (releaseId) => {
  const stored = await chrome.storage.local.get(['accessToken', 'accessTokenSecret', 'jwtToken', 'username']);
  const accessToken = decryptToken(stored.accessToken);
  const accessTokenSecret = decryptToken(stored.accessTokenSecret);
  const userName = stored.username;

  const res = await authenticatedFetch(`/users/${userName}/wants/${releaseId}`, {
    method: 'DELETE',
    body: {
      accessToken: accessToken,
      accessTokenSecret: accessTokenSecret,
    }
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  };
};
