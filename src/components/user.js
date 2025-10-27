import Alpine from '@alpinejs/csp';

export default function () {
  return {
    async displayUser() {
      this.loading = true;
      Alpine.store('authorized', false);

      const stored = await chrome.storage.local.get(['username']);
      const username = stored.username;

      if (!username) {
        this.loading = false;
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
