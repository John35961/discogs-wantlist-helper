const MAX_STORED_RESULTS = 50;

export default function () {
  return {
    query: '',
    results: [],
    hasNextPage: false,
    nextPage: null,
    remainingResultsCount: 0,

    async init() {
      const stored = await chrome.storage.local.get(['query', 'results', 'hasNextPage', 'nextPage', 'remainingResultsCount']);
      this.query = stored.query;
      this.results = stored.results;
      this.hasNextPage = stored.hasNextPage;
      this.nextPage = stored.nextPage;
      this.remainingResultsCount = stored.remainingResultsCount;
    },

    async handleSearch() {
      this.fetching = true;
      this.message = '';
      this.error = '';

      const query = this.query;

      if (!query) {
        this.error = 'Search query is missing';
        this.fetching = false;
        this.results = null;
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

        await chrome.storage.local.set({
          query: this.query,
          results: data.results,
          hasNextPage: this.hasNextPage,
          nextPage: this.nextPage,
          remainingResultsCount: this.remainingResultsCount,
        });
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

        await chrome.storage.local.set({
          results: this.results.slice(0, MAX_STORED_RESULTS),
          hasNextPage: this.hasNextPage,
          nextPage: this.nextPage,
          remainingResultsCount: this.remainingResultsCount,
        });
      } else {
        this.error = response.error;
      };
    },
  };
};
