import { authenticatedFetch, decryptToken } from './utils.js';

export const searchDatabase = async (query, page) => {
  const stored = await chrome.storage.local.get(['accessToken', 'accessTokenSecret', 'jwtToken']);
  const accessToken = decryptToken(stored.accessToken);
  const accessTokenSecret = decryptToken(stored.accessTokenSecret);

  const url = `/database/search?accessToken=${accessToken}&accessTokenSecret=${accessTokenSecret}&q=${encodeURIComponent(query)}&page=${page}`;
  const res = await authenticatedFetch(url, { method: 'GET' });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};
