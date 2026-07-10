import React, { useEffect, useState } from 'react';
import { authApi } from '../api/client';

const validateEmail = (value) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value);
};

export default function Account({ onProfileUpdate }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
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

  const validateForm = (values) => {
    const nextErrors = {};
    if (!values.username.trim()) {
      nextErrors.username = 'Username is required.';
    } else if (values.username.trim().length < 3) {
      nextErrors.username = 'Username must be at least 3 characters.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!validateEmail(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (values.password && values.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    const nextForm = { ...form, [e.target.name]: e.target.value };
    setForm(nextForm);
    setErrors(validateForm(nextForm));
    setMessage('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setMessage('Please correct the highlighted fields.');
      return;
    }

    setMessage('');
    try {
      const updated = await authApi.updateProfile({ username: form.username, email: form.email, password: form.password || undefined });
      setUser(updated);
      setForm({ username: updated.username || '', email: updated.email || '', password: '' });
      setErrors({});
      setMessage('Profile updated successfully.');
      if (onProfileUpdate) onProfileUpdate(updated);
    } catch (err) {
      setMessage(err.message || 'Update failed');
    }
  };

  if (loading) return <div className="account account-shell">Loading...</div>;
  if (!user) return <div className="account account-shell">Not authenticated.</div>;

  return (
    <section className="account account-shell">
      <div className="account-card">
        <div className="account-header">
          <div>
            <p className="account-label">Account profile</p>
            <h2>Manage your info</h2>
          </div>
          <span className="account-role">{user.role?.toUpperCase() || 'Reader'}</span>
        </div>

        <form onSubmit={submit} className="account-form">
          <label className="form-field">
            <span>Username</span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className={errors.username ? 'input-error' : ''}
              placeholder="Enter your username"
            />
            {errors.username && <p className="field-error">{errors.username}</p>}
          </label>

          <label className="form-field">
            <span>Email</span>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="you@example.com"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </label>

          <label className="form-field">
            <span>New Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              placeholder="Leave blank to keep current password"
            />
            <p className="field-note">Minimum 8 characters if changing password.</p>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </label>

          <button type="submit" className="account-submit-btn" disabled={Object.keys(errors).length > 0}>
            Save changes
          </button>

          {message && <div className={`account-message ${Object.keys(errors).length > 0 ? 'error' : 'success'}`}>{message}</div>}
        </form>
      </div>
    </section>
  );
}
