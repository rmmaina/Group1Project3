import React, { useEffect, useState } from 'react';
import { authApi } from '../api/client';

export default function Account({ onProfileUpdate }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    authApi
      .me()
      .then((data) => {
        if (!mounted) return;
        setUser(data);
        setForm({ username: data.username || '', email: data.email || '', password: '' });
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const updated = await authApi.updateProfile({ username: form.username, email: form.email, password: form.password || undefined });
      setUser(updated);
      setForm({ username: updated.username || '', email: updated.email || '', password: '' });
      setMessage('Profile updated');
      if (onProfileUpdate) onProfileUpdate(updated);
    } catch (err) {
      setMessage(err.message || 'Update failed');
    }
  };

  if (loading) return <div className="account">Loading...</div>;
  if (!user) return <div className="account">Not authenticated.</div>;

  return (
    <div className="account">
      <h2>Account</h2>
      <form onSubmit={submit} className="account-form">
        <label>
          Username
          <input name="username" value={form.username} onChange={handleChange} />
        </label>

        <label>
          Email
          <input name="email" value={form.email} onChange={handleChange} />
        </label>

        <label>
          New Password
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </label>

        <button type="submit">Save</button>
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
}
