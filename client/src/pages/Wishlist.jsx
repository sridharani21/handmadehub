import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

export default function Wishlist() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast } = useToast();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/auth/wishlist').then(r => { setProducts(r.data); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🌸</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: 6 }}>My Wishlist 💝</h1>
        <p style={{ color: 'var(--text-light)' }}>{products.length} item{products.length !== 1 ? 's' : ''} saved</p>
      </div>

      {products.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          background: 'white', borderRadius: 24,
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{ fontSize: '5rem', marginBottom: 16 }}>💝</div>
          <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', marginBottom: 8 }}>Your wishlist is empty</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: 28 }}>Save items you love by tapping the heart icon 🤍</p>
          <button className="btn-primary" onClick={() => navigate('/shop')}>Explore Shop 🌸</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {products.map(p => <ProductCard key={p._id} product={p} onToast={showToast} />)}
        </div>
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
