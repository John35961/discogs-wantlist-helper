import { getRequestToken, getAccessToken } from './discogs/oauth.js';
import { getIdentity, getUser, addToWantlist } from './discogs/api.js';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    const action = message.action

    if (action == 'getRequestToken') {
      const requestToken = await getRequestToken();
      sendResponse({ success: true, ...requestToken });
    }

    if (action == 'completeAuthFlow') {
      try {
        await getAccessToken(message.requestToken, message.requestTokenSecret, message.verifier);
        const identity = await getIdentity();
        sendResponse({ success: true, ...identity });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    }

    if (action == 'getIdentity') {
      try {
        const identity = await getIdentity();
        sendResponse({ success: true, ...identity });
      } catch (error) {
        sendResponse({ success: false });
      }
    }

    if (action == 'getUser') {
      try {
        const user = await getUser(message.username);
        sendResponse({ success: true, ...user });
      } catch (error) {
        sendResponse({ success: false });
      }
    }

    if (action == 'addToWantlist') {
      try {
        const release = await addToWantlist(message.releaseId);
        sendResponse({ success: true, release, message: `Added release to wantlist` });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    }
  })();

  return true;
});
