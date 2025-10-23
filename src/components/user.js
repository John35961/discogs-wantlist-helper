export default function () {
  return {
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
  };
};
