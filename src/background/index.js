import { getRequestToken, getAccessToken, getIdentity } from './discogs/oauth.js';
import { getUser, searchForReleases, addToWantlist } from './discogs/api.js';

const actions = {
  async getRequestToken() {
    const requestToken = await getRequestToken();
    return { success: true, ...requestToken };
  },

  async completeAuthFlow({ requestToken, requestTokenSecret, verifier }) {
    await getAccessToken(requestToken, requestTokenSecret, verifier);
    const identity = await getIdentity();
    return { success: true, ...identity };
  },

  async getIdentity() {
    const identity = await getIdentity();
    return { success: true, ...identity };
  },

  async getUser({ username }) {
    const user = await getUser(username);
    return { success: true, ...user };
  },

  async searchForReleases({ query }) {
    const releases = await searchForReleases(query);
    return { success: true, releases };
  },

  async addToWantlist({ releaseId }) {
    const release = await addToWantlist(releaseId);
    return { success: true, release, message: `Added release to wantlist` };
  },
}

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
