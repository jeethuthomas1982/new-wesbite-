const API = (() => {
  const BASE = '/api';

  function getToken() { return localStorage.getItem('medishop_token'); }
  function setToken(t) { localStorage.setItem('medishop_token', t); }
  function removeToken() { localStorage.removeItem('medishop_token'); }
  function getUser() { try { return JSON.parse(localStorage.getItem('medishop_user')); } catch { return null; } }
  function setUser(u) { localStorage.setItem('medishop_user', JSON.stringify(u)); }
  function removeUser() { localStorage.removeItem('medishop_user'); }

  async function request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  const get = (path) => request('GET', path);
  const post = (path, body) => request('POST', path, body);
  const put = (path, body) => request('PUT', path, body);
  const del = (path) => request('DELETE', path);

  return {
    getToken, setToken, removeToken,
    getUser, setUser, removeUser,
    isLoggedIn: () => !!getToken(),
    logout: () => { removeToken(); removeUser(); },
    auth: {
      login: (body) => post('/auth/login', body),
      register: (body) => post('/auth/register', body),
      me: () => get('/auth/me'),
    },
    products: {
      list: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return get('/products' + (qs ? '?' + qs : ''));
      },
      get: (id) => get('/products/' + id),
      categories: () => get('/products/categories'),
    },
    cart: {
      list: () => get('/cart'),
      add: (product_id, quantity) => post('/cart/add', { product_id, quantity }),
      update: (itemId, quantity) => put('/cart/update/' + itemId, { quantity }),
      remove: (itemId) => del('/cart/remove/' + itemId),
      clear: () => del('/cart/clear'),
    },
    orders: {
      place: (body) => post('/orders/place', body),
      list: () => get('/orders'),
      get: (id) => get('/orders/' + id),
    },
  };
})();
