import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, var(--brown), #3d2314)',
      color: 'white',
      marginTop: 80,
      padding: '48px 24px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: '2rem' }}>🌸</span>
              <div>
                <div style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', fontWeight: 700 }}>Handmade</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7, letterSpacing: 2 }}>WITH LOVE</div>
              </div>
            </div>
            <p style={{ opacity: 0.75, lineHeight: 1.7, fontSize: '0.9rem' }}>
              Every piece is crafted with love and care, just for you. 🤍
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'Playfair Display', marginBottom: 16, fontSize: '1rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['/', 'Home'], ['/shop', 'Shop All'], ['/wishlist', 'Wishlist'], ['/orders', 'My Orders']].map(([to, label]) => (
                <Link key={to} to={to} style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--pink)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontFamily: 'Playfair Display', marginBottom: 16, fontSize: '1rem' }}>Categories</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Crochet', 'Jewelry', 'Candles', 'Bags', 'Home Decor', 'Keychains'].map(c => (
                <Link key={c} to={`/shop?category=${c}`}
                  style={{
                    background: 'rgba(255,255,255,0.1)', color: 'white',
                    padding: '4px 12px', borderRadius: 50,
                    fontSize: '0.8rem', textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.target.style.background = 'var(--pink)'; e.target.style.borderColor = 'var(--pink)'; }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
                  {c}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Playfair Display', marginBottom: 16, fontSize: '1rem' }}>Connect With Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ opacity: 0.75, fontSize: '0.9rem' }}>
                📍 Chennai, Tamil Nadu
              </p>
              <a href="mailto:dhaarushandmadehub@gmail.com"
                style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--pink)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}>
                📧 dhaarushandmadehub@gmail.com
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/dhaarus_handmade_hub?utm_source=qr&igsh=MTZidmc4bnBicnhjZQ=="
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                  padding: '10px 18px', borderRadius: 50,
                  textDecoration: 'none', color: 'white',
                  fontWeight: 700, fontSize: '0.88rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 12px rgba(220,39,67,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(220,39,67,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(220,39,67,0.3)'; }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @DHAARUS_HANDMADE_HUB
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 20, textAlign: 'center', opacity: 0.6, fontSize: '0.85rem' }}>
          © 2024 Handmade With Love. Made with 🌸 in Chennai.
        </div>
      </div>
    </footer>
  );
}
