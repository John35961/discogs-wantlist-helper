export default function () {
  return {
    async handleSearch() {
      this.results = [];
      this.message = '';
      this.error = '';

      const query = this.query;

      if (!query) {
        this.error = 'Search query is missing';
        return;
      };

      const response = await chrome.runtime.sendMessage({ action: 'searchForReleases', query });

      if (response.success) {
        this.results = response.results;
      } else {
        this.error = response.error;
      };
    },

    async addReleaseFromSearch(result) {
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
  };
};
