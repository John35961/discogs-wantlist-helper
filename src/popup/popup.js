import Alpine from '@alpinejs/csp';
import { parseArtists, parseReleaseId } from '../background/discogs/utils.js';
import '@fortawesome/fontawesome-free/css/all.css';

Alpine.data('popup', () => ({
  loading: true,
  authorized: false,
  username: null,
  userDetails: {},
  releaseId: null,
  release: null,
  message: '',
  error: '',

  async displayUser() {
    this.loading = true;

    const authValid = await chrome.runtime.sendMessage({ action: 'getIdentity' });
    if (!authValid.success) {
      this.loading = false;
      this.authorized = false;
      return;
    }

    if (authValid) {
      this.authorized = true;
    }

    const stored = await chrome.storage.local.get(['username']);
    this.username = stored.username || '';
    if (!this.username) {
      this.loading = false;
      this.authorized = false;
      return;
    }

    const user = await chrome.runtime.sendMessage({ action: 'getUser', username: this.username });
    if (user.success) {
      this.userDetails = {
        ...user,
        uri: `https://www.discogs.com/user/${user.username}`
      }
    }

    this.loading = false;
  },

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

      if (response.success) {
        console.log('Auth succeeded:', response.identity);
      } else {
        console.error('Auth failed:', response.error);
      }
    });
  },

  handleSubmit(e) {
    const form = e.target;
    const formData = new FormData(form);

    try {
      const releaseId = parseReleaseId(formData.get('releaseId'));

      if (!releaseId) {
        this.release = null;
        this.message = '';
        this.error = 'URL or release ID is missing';
        return;
      };

      chrome.runtime.sendMessage(
        { action: 'addToWantlist', releaseId },
        (response) => {

          this.release = null;
          this.message = '';
          this.error = '';

          if (response.success) {
            const info = response.release.basic_information;

            this.userDetails.num_wantlist++;
            this.message = response.message;
            this.release = {
              ...info,
              artists: parseArtists(info.artists),
              uri: `https://discogs.com/release/${releaseId}`
            }
          }
          else {
            this.error = response.error;
          }
        })
    } catch (error) {
      this.release = null;
      this.message = '';
      this.error = error.message;
    }
  },
}))

Alpine.start();
