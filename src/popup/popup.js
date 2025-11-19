import Alpine from '@alpinejs/csp';
import oauth from '../components/oauth.js';
import user from '../components/user.js';
import tabs from '../components/tabs.js';
import search from '../components/search.js';
import resultItem from '../components/result_item.js';
import add from '../components/add.js';
import '@fortawesome/fontawesome-free/css/all.css';

Alpine.data('popup', () => ({
  version: import.meta.env.VITE_VERSION,
  supportLink: import.meta.env.VITE_SUPPORT_LINK,
  authorized: false,
  loading: true,
  fetching: false,
  user: {},
  release: null,
  releaseId: null,
  message: '',
  error: '',
}));
Alpine.data('oauth', oauth);
Alpine.data('user', user);
Alpine.data('tabs', tabs);
Alpine.data('search', search);
Alpine.data('resultItem', resultItem);
Alpine.data('add', add);

Alpine.start();
