export default function () {
  return {
    inWantlist: false,

    async handleRelease(result) {
      this.message = '';
      this.error = '';

      const releaseId = result.release.id;

      if (this.inWantlist) {
        const response = await chrome.runtime.sendMessage({ action: 'removeFromWantlist', releaseId });

        if (response.success) {
          result.message = 'Want';
          this.user.num_wantlist--;
          this.inWantlist = false;
        }
        else {
          this.error = response.error;
        };
      } else {
        const response = await chrome.runtime.sendMessage({ action: 'addToWantlist', releaseId });

        if (response.success) {
          result.message = 'Remove';
          this.user.num_wantlist++;
          this.inWantlist = true;
        }
        else {
          this.error = response.error;
        };
      };
    },

    onAdded(result) {
      if (result.message == 'Remove') return 'result-removable';
    },
  };
};
