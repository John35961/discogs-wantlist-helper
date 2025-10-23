export default function () {
  return {
    async initAuthFlow() {
      const { requestToken, requestTokenSecret } = await chrome.runtime.sendMessage({ action: 'getRequestToken' });
      const oauthUrl = `https://discogs.com/oauth/authorize?oauth_token=${requestToken}`;

      chrome.identity.launchWebAuthFlow({ url: oauthUrl, interactive: true }, async (redirectUrl) => {
        if (chrome.runtime.lastError) {
          console.error('Auth failed:', chrome.runtime.lastError);
          return;
        };

        const urlParams = new URLSearchParams(new URL(redirectUrl).search);
        const verifier = urlParams.get('oauth_verifier');
        const response = await chrome.runtime.sendMessage({ action: 'completeAuthFlow', requestToken, requestTokenSecret, verifier });

        if (!response.success) {
          console.log('Auth failed:', response.error);
        };
      });
    },
  };
};
