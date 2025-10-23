import { parseReleaseId } from '../background/discogs/utils.js';

export default function () {
  return {
    fetching: false,

    async handleAdd() {
      this.fetching = true;
      this.release = null;
      this.message = '';
      this.error = '';

      try {
        const releaseId = parseReleaseId(this.releaseId);

        if (!releaseId) {
          this.error = 'URL or release ID is missing';
          this.fetching = false;
          return;
        };

        const response = await chrome.runtime.sendMessage({ action: 'addToWantlist', releaseId });

        if (response.success) {
          this.message = response.message;
          this.release = response.release;
          this.userDetails.num_wantlist++;
        } else {
          this.error = response.error;

        };
      } catch (error) {
        this.error = error.message;
      };
      this.fetching = false;
    },
  };
};
