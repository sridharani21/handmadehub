import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      const res = await api.post(url, payload);
      login(res.data);
      navigate(res.data.isAdmin ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'linear-gradient(135deg, var(--pink-light), #f0e6ff)',
    }}>
      <div style={{
        background: 'white', borderRadius: 32, padding: 48, width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(249,168,201,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🌸</div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', fontWeight: 700, marginBottom: 6 }}>
            {isLogin ? 'Welcome Back!' : 'Join Us'}
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            {isLogin ? 'Sign in to your account' : 'Create your account today'}
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', background: 'var(--pink-light)',
          borderRadius: 50, padding: 4, marginBottom: 28,
        }}>
          {['Login', 'Register'].map((label, i) => (
            <button key={label} onClick={() => { setIsLogin(i === 0); setError(''); }}
              style={{
                flex: 1, padding: '10px', borderRadius: 50, border: 'none',
                background: (isLogin ? i === 0 : i === 1) ? 'var(--pink-dark)' : 'transparent',
                color: (isLogin ? i === 0 : i === 1) ? 'white' : 'var(--text)',
                fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito',
                transition: 'all 0.2s',
              }}>
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          {!isLogin && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>Full Name</label>
              <input className="input" name="name" value={form.name} onChange={handle}
                placeholder="Your name" required={!isLogin} />
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>Email</label>
            <input className="input" name="email" type="email" value={form.email} onChange={handle}
              placeholder="your@email.com" required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>Password</label>
            <input className="input" name="password" type="password" value={form.password} onChange={handle}
              placeholder="••••••••" required />
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 10, padding: '10px 14px', color: '#e53e3e', marginBottom: 16, fontSize: '0.9rem' }}>
              ❌ {error}
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
            {loading ? '⏳ Please wait...' : isLogin ? '🌸 Sign In' : '✨ Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-light)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--pink-dark)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
