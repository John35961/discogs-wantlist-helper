export default function () {
  return {
    fetching: false,

    async handleSearch() {
      this.fetching = true;
      this.results = [];
      this.message = '';
      this.error = '';

      const query = this.query;

      if (!query) {
        this.error = 'Search query is missing';
        this.fetching = false;
        return;
      };

      const response = await chrome.runtime.sendMessage({ action: 'searchDatabase', query });

      if (response.success) {
        this.results = response.results;
      } else {
        this.error = response.error;
      };

      this.fetching = false;
    },

    async addReleaseFromSearch(result) {
      const releaseId = result.release.id;

      const response = await chrome.runtime.sendMessage({ action: 'addToWantlist', releaseId });

      if (response.success) {
        result.message = 'Added';
        this.user.num_wantlist++;
      }
      else {
        this.error = response.error;
      };
    },

    onAdded(result) {
      if (result.message == 'Added') return 'result-added';
    },
  };
};
