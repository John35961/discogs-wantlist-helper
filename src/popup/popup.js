import Alpine from '@alpinejs/csp';
import auth from '../components/auth.js';
import user from '../components/user.js';
import search from '../components/search.js';
import add from '../components/add.js';
import '@fortawesome/fontawesome-free/css/all.css';

Alpine.data('popup', () => ({
  tab: 'search',
  loading: true,
  authorized: false,
  username: null,
  userDetails: {},
  query: '',
  results: [],
  releaseId: null,
  release: null,
  message: '',
  error: '',

  selectTab(name) {
    this.tab = name;
    this.query = '';
    this.releaseId = '';
    this.release = null;
    this.message = '';
    this.error = '';
  },
}));

Alpine.data('auth', auth);
Alpine.data('user', user);
Alpine.data('search', search);
Alpine.data('add', add);

Alpine.start();
