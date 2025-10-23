export default function () {
  return {
    tabName: 'search',

    selectTab(tabName) {
      this.tabName = tabName;
      this.query = '';
      this.releaseId = '';
      this.release = null;
      this.message = '';
      this.error = '';
    },

    isActiveTab(tabName) {
      return this.tabName === tabName ? 'tab active' : 'tab'
    },
  };
};
