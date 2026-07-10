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

export default { authApi, booksApi, bookClubApi };
