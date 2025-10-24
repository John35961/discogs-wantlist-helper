import Alpine from '@alpinejs/csp';
import auth from '../components/auth.js';
import user from '../components/user.js';
import tab from '../components/tab.js';
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
Alpine.data('auth', auth);
Alpine.data('user', user);
Alpine.data('tab', tab);
Alpine.data('search', search);
Alpine.data('add', add);

Alpine.start();
