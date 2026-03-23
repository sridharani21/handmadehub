import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const CATEGORIES = ['All', 'Crochet', 'Jewelry', 'Candles', 'Bags', 'Home Decor', 'Keychains', 'Cards', 'Other'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const { toasts, showToast } = useToast();

  const activeCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (search) params.set('search', search);
    params.set('sort', sort);
    api.get(`/products?${params}`).then(r => { setProducts(r.data); setLoading(false); });
  }, [activeCategory, search, sort]);

  const setCategory = (cat) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', marginBottom: 6 }}>Our Collection 🌸</h1>
        <p style={{ color: 'var(--text-light)' }}>Handmade with love, just for you</p>
      </div>

      {/* Search + Sort */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          className="input"
          style={{ flex: 1, minWidth: 200 }}
          placeholder="🔍 Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input" style={{ width: 'auto', minWidth: 160 }} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{
              padding: '8px 20px', borderRadius: 50,
              border: activeCategory === cat ? '2px solid var(--pink-dark)' : '2px solid var(--pink-light)',
              background: activeCategory === cat ? 'var(--pink-dark)' : 'white',
              color: activeCategory === cat ? 'white' : 'var(--text)',
              fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito',
              transition: 'all 0.2s',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ color: 'var(--text-light)', marginBottom: 20, fontSize: '0.9rem' }}>
        {products.length} item{products.length !== 1 ? 's' : ''} found
      </p>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🌸</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <p style={{ color: 'var(--text-light)', marginTop: 12 }}>Loading beautiful items...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontFamily: 'Playfair Display' }}>No products found</h3>
          <p>Try a different category or search term</p>
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
