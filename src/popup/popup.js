import Alpine from '@alpinejs/csp';
import oauth from '../components/oauth.js';
import user from '../components/user.js';
import tabs from '../components/tabs.js';
import search from '../components/search.js';
import add from '../components/add.js';
import '@fortawesome/fontawesome-free/css/all.css';

Alpine.data('popup', () => ({
  loading: true,
  authorized: false,
  username: null,
  user: {},
  query: '',
  results: [],
  releaseId: null,
  release: null,
  message: '',
  error: '',
}));
Alpine.data('oauth', oauth);
Alpine.data('user', user);
Alpine.data('tabs', tabs);
Alpine.data('search', search);
Alpine.data('add', add);

Alpine.start();
