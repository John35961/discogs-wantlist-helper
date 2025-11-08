export default function () {
  return {
    fetching: false,
    hasNextPage: false,
    nextPage: null,
    remainingResultsCount: 0,

    async handleSearch() {
      this.fetching = true;
      this.results = [];
      this.resultsCount = 0;
      this.message = '';
      this.error = '';

      const query = this.query;

      if (!query) {
        this.error = 'Search query is missing';
        this.fetching = false;
        return;
      };

      const page = 1;
      const response = await chrome.runtime.sendMessage({ action: 'searchDatabase', query, page });

      if (response.success) {
        const data = response.results;
        const pagination = data.pagination;

        this.results = data.results;
        this.hasNextPage = pagination.page < pagination.pages;
        this.nextPage = pagination.page + 1;
        this.remainingResultsCount = pagination.items - data.results.length;
      } else {
        this.error = response.error;
      };

      this.fetching = false;
    },

    async fetchNextResults(page) {
      const query = this.query;
      const response = await chrome.runtime.sendMessage({ action: 'searchDatabase', query, page });

      if (response.success) {
        const data = response.results;
        const pagination = data.pagination;

        this.results = [...this.results, ...data.results];
        this.hasNextPage = pagination.page < pagination.pages;
        this.nextPage = data.pagination.page + 1;
        this.remainingResultsCount = pagination.items - this.results.length;
      } else {
        this.error = response.error;
      };
    },
  };
};
