import Alpine from '@alpinejs/csp';
import { parseReleaseId } from '../background/discogs/utils.js';
import '@fortawesome/fontawesome-free/css/all.css';

Alpine.data('popup', () => ({
  tab: 'search',
  loading: true,
  authorized: false,
  username: null,
  userDetails: {},
  query: '',
  results: [],
  releaseId: null,
  release: null,
  message: '',
  error: '',

  selectTab(name) {
    this.tab = name;
    this.query = '';
    this.releaseId = '';
    this.release = null;
    this.message = '';
    this.error = '';
  },

  async displayUser() {
    this.loading = true;

    const authValid = await chrome.runtime.sendMessage({ action: 'getIdentity' });

    if (!authValid.success) {
      this.loading = false;
      this.authorized = false;
      return;
    };

    if (authValid) {
      this.authorized = true;
    };

    const stored = await chrome.storage.local.get(['username']);
    this.username = stored.username || '';

    if (!this.username) {
      this.loading = false;
      this.authorized = false;
      return;
    };

    const response = await chrome.runtime.sendMessage({ action: 'getUser', username: this.username });

    if (response.success) {
      this.userDetails = {
        ...response,
        uri: `https://www.discogs.com/user/${response.username}`
      }
    };

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

      if (!response.success) {
        console.log('Auth failed:', response.error);
      };
    });
  },

  async addByReleaseId() {
    this.release = null;
    this.message = '';
    this.error = '';

    try {
      const releaseId = parseReleaseId(this.releaseId);

      if (!releaseId) {
        this.error = 'URL or release ID is missing';
        return;
      };

      const response = await chrome.runtime.sendMessage({ action: 'addToWantlist', releaseId });

      if (response.success) {
        this.message = response.message;
        this.release = response.release;
        this.userDetails.num_wantlist++;
      } else {
        this.error = response.error;
      };
    } catch (error) {
      this.error = error.message;
    };
  },

  async search() {
    this.release = null;
    this.message = '';
    this.error = '';

    const query = this.query;

    if (!query) {
      this.error = 'Search query missing';
      return;
    };

    const response = await chrome.runtime.sendMessage({ action: 'searchForReleases', query });

    if (response.success) {
      this.results = response.results;
    } else {
      this.error = response.error;
    };
  },

  async addFromSearch(result) {
    const releaseId = result.release.id;

    const response = await chrome.runtime.sendMessage({ action: 'addToWantlist', releaseId });

    if (response.success) {
      result.message = 'Added';
      this.userDetails.num_wantlist++;
    }
    else {
      this.error = response.error;
    };
  },
}));

Alpine.start();
