const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:10000';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = options.headers || {};
  if (options.json !== false) {
    headers['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('library_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers, body: options.body ?? (options.json === false ? undefined : JSON.stringify(options.json)) });
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error((data && data.message) || data || res.statusText);
    return data;
  } catch (err) {
    if (text && !res.ok) throw new Error(text);
    if (!res.ok) throw err;
    return null;
  }
}

export const authApi = {
  register: async (payload) => await request('/auth/register', { method: 'POST', json: payload }),
  login: async (payload) => await request('/auth/login', { method: 'POST', json: payload }),
};

export const booksApi = {
  list: async () => await request('/books', { method: 'GET', json: false }),
  create: async (payload) => await request('/books', { method: 'POST', json: payload }),
  update: async (id, payload) => await request(`/books/${id}`, { method: 'PATCH', json: payload }),
  remove: async (id) => await request(`/books/${id}`, { method: 'DELETE', json: false }),
};

export const bookClubApi = {
  recommendations: async () => {
    // Try to fetch book club recommendations from backend, fall back to empty array
    try {
      const books = await request('/books', { method: 'GET', json: false });
      return (books || []).slice(0, 8).map((b) => ({
        book_id: b.id,
        title: b.title,
        author: b.author,
        cover_url: b.cover_url || b.coverUrl,
        average_rating: b.rating || 0,
        review_count: b.review_count || 0,
      }));
    } catch (err) {
      return [];
    }
  },
};

export const shelvesApi = {
  list: async () => await request('/shelves', { method: 'GET', json: false }),
  create: async (payload) => await request('/shelves', { method: 'POST', json: payload }),
  listBooks: async (shelfId) => await request(`/shelves/${shelfId}/books`, { method: 'GET', json: false }),
  addBook: async (shelfId, payload) => await request(`/shelves/${shelfId}/books`, { method: 'POST', json: payload }),
  updateBook: async (shelfId, bookId, payload) =>
    await request(`/shelves/${shelfId}/books/${bookId}`, { method: 'PATCH', json: payload }),
  removeBook: async (shelfId, bookId) =>
    await request(`/shelves/${shelfId}/books/${bookId}`, { method: 'DELETE', json: false }),
};

export const favoritesApi = {
  list: async () => await request('/favorites', { method: 'GET', json: false }),
  create: async (payload) => await request('/favorites', { method: 'POST', json: payload }),
  removeByExternalId: async (externalId) =>
    await request(`/favorites?external_id=${encodeURIComponent(externalId)}`, { method: 'DELETE', json: false }),
};

export const ordersApi = {
  create: async (payload) => await request('/orders', { method: 'POST', json: payload }),
  list: async () => await request('/orders', { method: 'GET', json: false }),
  get: async (id) => await request(`/orders/${id}`, { method: 'GET', json: false }),
};

export const usersApi = {
  list: async () => await request('/users', { method: 'GET', json: false }),
  update: async (userId, payload) => await request(`/users/${userId}`, { method: 'PATCH', json: payload }),
  remove: async (userId) => await request(`/users/${userId}`, { method: 'DELETE', json: false }),
};

export default { authApi, booksApi, bookClubApi, shelvesApi, favoritesApi, ordersApi, usersApi };