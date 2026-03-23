import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!open) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100vh',
        width: 'min(420px, 95vw)',
        background: 'white', zIndex: 200,
        boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
        borderRadius: '20px 0 0 20px',
        animation: 'slideInRight 0.3s ease',
      }}>
        <style>{`@keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '2px solid var(--pink-light)',
          background: 'linear-gradient(135deg, var(--pink-light), #fff)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderRadius: '20px 0 0 0'
        }}>
          <div style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', fontWeight: 700 }}>
            🛒 Your Cart
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ fontSize: '1.5rem' }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
              <div style={{ fontSize: '4rem', marginBottom: 12 }}>🌸</div>
              <div style={{ fontFamily: 'Playfair Display', fontSize: '1.1rem', marginBottom: 8 }}>Your cart is empty</div>
              <div style={{ fontSize: '0.9rem' }}>Add some lovely handmade items!</div>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} style={{
                display: 'flex', gap: 12, padding: '14px 0',
                borderBottom: '1px solid var(--pink-light)',
                alignItems: 'center',
              }}>
                <img
                  src={item.images?.[0] ? item.images[0] : 'https://via.placeholder.com/70x70?text=🌸'}
                  alt={item.name}
                  style={{ width: 70, height: 70, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{item.name}</div>
                  <div style={{ color: 'var(--pink-dark)', fontWeight: 700 }}>₹{item.price}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <button onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--pink)', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>−</button>
                    <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--pink)', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>+</button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>₹{item.price * item.qty}</div>
                  <button onClick={() => removeFromCart(item._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#e53e3e' }}>🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '2px solid var(--pink-light)', background: 'var(--pink-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontFamily: 'Playfair Display', fontSize: '1.1rem', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: 'var(--pink-dark)' }}>₹{total}</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }} onClick={handleCheckout}>
              Proceed to Checkout ✨
            </button>
            <button className="btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
