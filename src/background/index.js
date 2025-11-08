import { getRequestToken, storeAccessToken, getIdentity, storeUsername } from './discogs/oauth.js';
import { getUser, addToWantlist, removeFromWantlist } from './discogs/user.js';
import { searchDatabase } from './discogs/search.js';

const actions = {
  async getRequestToken() {
    const requestToken = await getRequestToken();
    return { success: true, ...requestToken };
  },

  async completeAuthFlow({ requestToken, requestTokenSecret, verifier }) {
    await storeAccessToken(requestToken, requestTokenSecret, verifier);
    await storeUsername();
    return { success: true };
  },

  async getUser({ username }) {
    await getIdentity();
    const user = await getUser(username);
    return { success: true, ...user };
  },

  async searchDatabase({ query, page }) {
    const results = await searchDatabase(query, page);
    return { success: true, results };
  },

  async addToWantlist({ releaseId }) {
    const release = await addToWantlist(releaseId);
    return { success: true, ...release };
  },

  async removeFromWantlist({ releaseId }) {
    await removeFromWantlist(releaseId);
    return { success: true };
  },
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    const { action, ...payload } = message;
    const handler = actions[action];

    try {
      const result = await handler(payload);
      sendResponse(result);
    } catch (error) {
      sendResponse({ success: false, error: error.message || 'Unexpected error' });
    }
  })();

  return true;
});
