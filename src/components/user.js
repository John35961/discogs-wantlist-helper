import Alpine from '@alpinejs/csp';

export default function () {
  return {
    username: null,
    user: {},

    async displayUser() {
      this.loading = true;

      const stored = await chrome.storage.local.get(['jwtToken', 'username']);
      const username = stored.username;
      const jwtToken = stored.jwtToken;

      if (!jwtToken) {
        this.loading = false;
        return;
      };

      if (!username) {
        this.loading = false;
        return;
      };

      const response = await chrome.runtime.sendMessage({ action: 'getUser', username: username });

      if (response.success) {
        Alpine.store('authorized', true);
        this.user = response.user;
        this.username = username;
      };

      this.loading = false;
    },
  };
};
