import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const CATEGORIES = ['Crochet', 'Jewelry', 'Candles', 'Bags', 'Home Decor', 'Keychains', 'Cards'];
const CAT_ICONS = { Crochet: '🧶', Jewelry: '💍', Candles: '🕯️', Bags: '👜', 'Home Decor': '🏠', Keychains: '🔑', Cards: '💌' };

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products?sort=rating').then(r => setFeatured(r.data.slice(0, 8)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #fff0f6 0%, #fce4ef 50%, #f0e6ff 100%)',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: [80, 120, 60, 100, 70, 90][i],
            height: [80, 120, 60, 100, 70, 90][i],
            borderRadius: '50%',
            background: ['var(--pink)', 'var(--lavender)', 'var(--peach)', 'var(--mint)', 'var(--pink-light)', 'var(--lavender)'][i],
            opacity: 0.2,
            top: ['10%', '60%', '80%', '20%', '40%', '70%'][i],
            left: ['5%', '90%', '15%', '80%', '50%', '70%'][i],
            animation: `float${i} ${[4, 5, 3, 6, 4.5, 5.5][i]}s ease-in-out infinite alternate`,
          }} />
        ))}
        <style>{`
          @keyframes float0 { from { transform: translateY(0) } to { transform: translateY(-20px) } }
          @keyframes float1 { from { transform: translateY(0) } to { transform: translateY(-15px) } }
          @keyframes float2 { from { transform: translateY(0) } to { transform: translateY(-25px) } }
          @keyframes float3 { from { transform: translateY(0) } to { transform: translateY(-10px) } }
          @keyframes float4 { from { transform: translateY(0) } to { transform: translateY(-18px) } }
          @keyframes float5 { from { transform: translateY(0) } to { transform: translateY(-22px) } }
        `}</style>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🌸</div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: 'var(--brown)', marginBottom: 20, lineHeight: 1.2 }}>
            Handcrafted with Love,<br />
            <span style={{ color: 'var(--pink-dark)', fontStyle: 'italic' }}>Made for You</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: 36, lineHeight: 1.7 }}>
            Every item is uniquely handmade — crochet, jewelry, candles & more. 
            Find the perfect piece that tells your story. 💝
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop"><button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>Shop Now ✨</button></Link>
            <Link to="/shop"><button className="btn-outline" style={{ padding: '14px 36px', fontSize: '1rem' }}>Browse Categories</button></Link>
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section style={{ background: 'var(--pink-dark)', color: 'white', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[['🎁', '100% Handmade'], ['💝', 'Made with Love'], ['🚚', 'Pan India Delivery'], ['⭐', '5★ Reviews']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
              <span style={{ fontSize: '1.4rem' }}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', textAlign: 'center', marginBottom: 8 }}>Shop by Category</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: 40 }}>Find your perfect handmade treasure 🌸</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <div key={cat} onClick={() => navigate(`/shop?category=${cat}`)}
                className="card"
                style={{
                  padding: '24px 16px', textAlign: 'center', cursor: 'pointer',
                  border: '2px solid var(--pink-light)',
                }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{CAT_ICONS[cat]}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{cat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '0 24px 64px', background: 'linear-gradient(to bottom, white, var(--cream))' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: 4 }}>Featured Items</h2>
              <p style={{ color: 'var(--text-light)' }}>Handpicked just for you ✨</p>
            </div>
            <Link to="/shop"><button className="btn-outline">View All →</button></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {featured.map(p => <ProductCard key={p._id} product={p} onToast={showToast} />)}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: 'linear-gradient(135deg, var(--lavender), var(--pink-light))',
        padding: '60px 24px', textAlign: 'center', margin: '0 24px 64px',
        borderRadius: 32,
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>💌</div>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', marginBottom: 12, color: 'var(--brown)' }}>
            Custom Orders Welcome!
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: 28, lineHeight: 1.7 }}>
            Want something made especially for you? Reach out and let's create something magical together.
          </p>
          <a href="https://www.instagram.com/dhaarus_handmade_hub?utm_source=qr&igsh=MTZidmc4bnBicnhjZQ==">
            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>Get in Touch 🌸</button>
          </a>
        </div>
      </section>

      <Toast toasts={toasts} />
    </div>
  );
}
