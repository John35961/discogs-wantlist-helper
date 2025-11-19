import Alpine from '@alpinejs/csp';

export default function () {
  return {
    username: null,

    async displayUser() {
      this.loading = true;

      const stored = await chrome.storage.local.get(['username']);
      const username = stored.username;

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
