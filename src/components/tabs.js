export default function () {
  return {
    activeTab: 'search',

    async init() {
      const stored = await chrome.storage.local.get(['lastTab']);
      if (stored.lastTab) {
        this.activeTab = stored.lastTab;
      }
    },

    async selectTab(tabName) {
      this.activeTab = tabName;
      await chrome.storage.local.set({ lastTab: tabName });

      this.query = '';
      this.releaseId = '';
      this.release = null;
      this.message = '';
      this.error = '';
    },

    isActiveTab(tabName) {
      return this.activeTab === tabName;
    },

    activeTabClass(tabName) {
      return this.activeTab === tabName ? 'tab active' : 'tab';
    },
  };
};
