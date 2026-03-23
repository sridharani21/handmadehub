import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  Processing: { bg: '#fefcbf', color: '#744210' },
  Shipped:    { bg: '#bee3f8', color: '#2c5282' },
  Delivered:  { bg: '#c6f6d5', color: '#22543d' },
  Cancelled:  { bg: '#fed7d7', color: '#742a2a' },
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(null); // order to cancel
  const [cancelling, setCancelling] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    load();
  }, []);

  const load = () => {
    api.get('/orders/my').then(r => { setOrders(r.data); setLoading(false); });
  };

  const cancelOrder = async () => {
    setCancelling(true);
    try {
      await api.patch(`/orders/${confirmCancel._id}/cancel`);
      setMsg('✅ Order cancelled successfully');
      setConfirmCancel(null);
      load();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Failed to cancel'));
      setConfirmCancel(null);
    } finally {
      setCancelling(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🌸</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <div className="page">

      {/* ===== CANCEL CONFIRM MODAL ===== */}
      {confirmCancel && (
        <>
          <div className="overlay" onClick={() => setConfirmCancel(null)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white', borderRadius: 24, padding: 36,
            width: 'min(420px, 92vw)', zIndex: 300,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            textAlign: 'center',
            animation: 'fadeUp 0.2s ease',
          }}>
          <style>{`@keyframes fadeUp { from { opacity:0; transform:translate(-50%,-45%) } to { opacity:1; transform:translate(-50%,-50%) } }`}</style>

            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>😟</div>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', marginBottom: 10 }}>
              Cancel Order?
            </h2>
            <p style={{ color: 'var(--text-light)', marginBottom: 16, lineHeight: 1.6 }}>
              Are you sure you want to cancel this order?
            </p>

            {/* Order summary in modal */}
            <div style={{ background: 'var(--pink-light)', borderRadius: 14, padding: '14px 18px', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 8 }}>
                ORDER #{confirmCancel._id.slice(-8).toUpperCase()}
              </div>
              {confirmCancel.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < confirmCancel.items.length - 1 ? 8 : 0 }}>
                  <img src={item.image || 'https://via.placeholder.com/40?text=🌸'} alt={item.name}
                    style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>x{item.quantity} · ₹{item.price}</div>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '1px dashed var(--pink)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--pink-dark)' }}>₹{confirmCancel.totalAmount}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#e53e3e', marginBottom: 24, fontWeight: 600 }}>
              ⚠️ This cannot be undone. Only Processing orders can be cancelled.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              {/* Cancel button — closes modal */}
              <button
                onClick={() => setConfirmCancel(null)}
                className="btn-outline"
                style={{ flex: 1, justifyContent: 'center' }}
                disabled={cancelling}>
                ✕ Keep Order
              </button>
              {/* Confirm cancel */}
              <button
                onClick={cancelOrder}
                disabled={cancelling}
                style={{
                  flex: 1, padding: '12px', borderRadius: 50,
                  background: 'linear-gradient(135deg, #e53e3e, #c53030)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.95rem',
                  opacity: cancelling ? 0.7 : 1,
                }}>
                {cancelling ? '⏳ Cancelling...' : '❌ Yes, Cancel'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: 6 }}>My Orders 📦</h1>
        <p style={{ color: 'var(--text-light)' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
      </div>

      {/* Message */}
      {msg && (
        <div style={{
          padding: '12px 18px', borderRadius: 12, marginBottom: 20, fontWeight: 600,
          background: msg.startsWith('✅') ? '#c6f6d5' : '#fed7d7',
          color: msg.startsWith('✅') ? '#22543d' : '#742a2a',
        }}>
          {msg}
        </div>
      )}

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'white', borderRadius: 24, boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>📭</div>
          <h3 style={{ fontFamily: 'Playfair Display', marginBottom: 8 }}>No orders yet</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>Your orders will appear here</p>
          <button className="btn-primary" onClick={() => navigate('/shop')}>Start Shopping 🛍️</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map(order => (
            <div key={order._id} style={{
              background: 'white', borderRadius: 20, padding: 24,
              boxShadow: 'var(--shadow)',
              borderLeft: `4px solid ${order.orderStatus === 'Cancelled' ? '#fc8181' : order.orderStatus === 'Delivered' ? '#68d391' : order.orderStatus === 'Shipped' ? '#63b3ed' : 'var(--pink)'}`,
            }}>

              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-light)', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: 4 }}>ORDER ID</div>
                  <div style={{ fontFamily: 'Playfair Display', fontWeight: 700 }}>#{order._id.slice(-8).toUpperCase()}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: 2 }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span style={{
                    ...STATUS_COLORS[order.orderStatus],
                    padding: '5px 16px', borderRadius: 50,
                    fontSize: '0.82rem', fontWeight: 700,
                  }}>
                    {order.orderStatus === 'Processing' && '⏳ '}
                    {order.orderStatus === 'Shipped' && '🚚 '}
                    {order.orderStatus === 'Delivered' && '✅ '}
                    {order.orderStatus === 'Cancelled' && '❌ '}
                    {order.orderStatus}
                  </span>
                  {/* Cancel button — only show for Processing orders */}
                  {order.orderStatus === 'Processing' && (
                    <button
                      onClick={() => setConfirmCancel(order)}
                      style={{
                        padding: '6px 16px', borderRadius: 50, cursor: 'pointer',
                        border: '2px solid #fed7d7', background: 'white',
                        color: '#e53e3e', fontFamily: 'Nunito', fontWeight: 700,
                        fontSize: '0.82rem', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fff5f5'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}>
                      ✕ Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: order.orderStatus === 'Cancelled' ? '#fff5f5' : 'var(--pink-light)',
                    borderRadius: 12, padding: '10px 14px',
                  }}>
                    <img src={item.image || 'https://via.placeholder.com/44?text=🌸'} alt={item.name}
                      style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', opacity: order.orderStatus === 'Cancelled' ? 0.5 : 1 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>x{item.quantity} · ₹{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer row */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 10,
                borderTop: '1px solid var(--pink-light)', paddingTop: 14,
              }}>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 700 }}>PAYMENT </span>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{order.paymentMethod}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 700 }}>STATUS </span>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: order.paymentStatus === 'Paid' ? '#38a169' : '#e53e3e' }}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', fontWeight: 700, color: 'var(--pink-dark)' }}>
                  ₹{order.totalAmount}
                </div>
              </div>

              {/* Cancelled notice */}
              {order.orderStatus === 'Cancelled' && (
                <div style={{
                  marginTop: 12, background: '#fff5f5', borderRadius: 10,
                  padding: '10px 14px', fontSize: '0.85rem', color: '#c53030',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  ❌ This order has been cancelled.
                  {order.paymentMethod === 'Online' && order.paymentStatus === 'Paid' &&
                    ' Refund will be processed within 5-7 business days.'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
