import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
  };

  return (
    <>
      <nav style={{
        background: 'white',
        boxShadow: '0 2px 20px rgba(249,168,201,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '2px solid var(--pink-light)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.8rem' }}>🌸</span>
            <div>
              <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '1.3rem', color: 'var(--pink-dark)', lineHeight: 1.1 }}>
                Handmade
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                with love
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hidden-mobile">
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--pink-dark)'}
              onMouseLeave={e => e.target.style.color = 'var(--text)'}>Home</Link>
            <Link to="/shop" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--pink-dark)'}
              onMouseLeave={e => e.target.style.color = 'var(--text)'}>Shop</Link>
            {user && (
              <Link to="/wishlist" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--pink-dark)'}
                onMouseLeave={e => e.target.style.color = 'var(--text)'}>💝 Wishlist</Link>
            )}
            {user && (
              <Link to="/orders" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--pink-dark)'}
                onMouseLeave={e => e.target.style.color = 'var(--text)'}>My Orders</Link>
            )}
          </div>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="btn-ghost" style={{ position: 'relative' }}>
              <span style={{ fontSize: '1.4rem' }}>🛒</span>
              {count > 0 && <span className="badge">{count}</span>}
            </button>

            {/* User */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setDropOpen(!dropOpen)} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--pink), var(--lavender))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '0.9rem'
                  }}>
                    {user.name[0].toUpperCase()}
                  </div>
                </button>
                {dropOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '110%',
                    background: 'white', borderRadius: 16, boxShadow: 'var(--shadow-hover)',
                    border: '1px solid var(--pink-light)', minWidth: 180,
                    overflow: 'hidden', zIndex: 100,
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--pink-light)', background: 'var(--pink-light)' }}>
                      <div style={{ fontWeight: 700 }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{user.email}</div>
                    </div>
                    {user.isAdmin && (
                      <Link to="/admin" onClick={() => setDropOpen(false)}
                        style={{ display: 'block', padding: '10px 16px', textDecoration: 'none', color: 'var(--text)', fontWeight: 600 }}
                        onMouseEnter={e => e.target.style.background = 'var(--pink-light)'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}>
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <Link to="/orders" onClick={() => setDropOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', textDecoration: 'none', color: 'var(--text)', fontWeight: 600 }}
                      onMouseEnter={e => e.target.style.background = 'var(--pink-light)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}>
                      📦 My Orders
                    </Link>
                    <button onClick={handleLogout}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', fontWeight: 600, fontFamily: 'Nunito' }}
                      onMouseEnter={e => e.target.style.background = '#fff5f5'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="btn-primary" style={{ padding: '8px 20px' }}>Login</button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
