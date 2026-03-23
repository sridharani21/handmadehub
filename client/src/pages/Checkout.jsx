import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', street: '', city: '', state: '', pincode: '', phone: '' });
  const [savedAddress, setSavedAddress] = useState(null);
  const [useDefault, setUseDefault] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(50);
  const [freeAbove, setFreeAbove] = useState(500);

  useEffect(() => {
    if (!user) return;
    // Load delivery settings
    api.get('/settings').then(r => {
      setDeliveryCharge(r.data.deliveryCharge);
      setFreeAbove(r.data.freeDeliveryAbove);
    }).catch(() => {});

    // Load saved address from profile
    api.get('/auth/profile').then(r => {
      if (r.data.address?.street) {
        setSavedAddress({ name: r.data.name, ...r.data.address });
        setUseDefault(true);
        setForm({ name: r.data.name, ...r.data.address });
      } else {
        setForm(f => ({ ...f, name: r.data.name || '' }));
      }
    }).catch(() => {});
  }, [user]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const actualDelivery = total >= freeAbove ? 0 : deliveryCharge;
  const orderTotal = total + actualDelivery;

  if (!user) { navigate('/login'); return null; }
  if (cart.length === 0) { navigate('/shop'); return null; }

  const saveAddressToProfile = async () => {
    try {
      await api.put('/auth/profile', {
        name: form.name,
        address: {
          street: form.street, city: form.city,
          state: form.state, pincode: form.pincode, phone: form.phone,
        },
      });
      setSavedAddress({ ...form });
    } catch {}
  };

  const placeOrder = async () => {
    setError('');
    const addr = useDefault && !editingAddress ? savedAddress : form;
    if (!addr.street || !addr.city || !addr.state || !addr.pincode || !addr.phone) {
      setError('Please fill all address fields');
      return;
    }
    if (paymentMethod === 'Online' && !utrNumber.trim()) {
      setError('Please enter UTR/Transaction number after payment');
      return;
    }
    setLoading(true);
    try {
      // Save address as default if new
      if (!useDefault || editingAddress) await saveAddressToProfile();

      await api.post('/orders', {
        items: cart.map(i => ({
          product: i._id, name: i.name,
          image: i.images?.[0] || '', price: i.price, quantity: i.qty,
        })),
        shippingAddress: addr,
        paymentMethod,
        utrNumber: paymentMethod === 'Online' ? utrNumber : undefined,
        totalAmount: orderTotal,
      });
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: 32 }}>Checkout 🛍️</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>

        {/* ── LEFT ── */}
        <div>
          {/* Address Section */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem' }}>📦 Delivery Address</h2>
            </div>

            {/* Saved default address */}
            {savedAddress && !editingAddress && (
              <div>
                <div style={{
                  background: 'var(--pink-light)', borderRadius: 14,
                  padding: '16px 18px', marginBottom: 16,
                  border: '2px solid var(--pink)',
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ background: 'var(--pink-dark)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: 50 }}>
                          ✅ DEFAULT
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{savedAddress.name}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.7 }}>
                        {savedAddress.street}<br />
                        {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}<br />
                        📞 {savedAddress.phone}
                      </div>
                    </div>
                    <button
                      onClick={() => { setEditingAddress(true); setForm({ ...savedAddress }); }}
                      style={{
                        background: 'white', border: '2px solid var(--pink)',
                        borderRadius: 50, padding: '6px 14px', cursor: 'pointer',
                        fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.82rem',
                        color: 'var(--pink-dark)', flexShrink: 0,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--pink-light)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      ✏️ Edit
                    </button>
                  </div>
                </div>

                {/* Option to use different address */}
                <button
                  onClick={() => { setEditingAddress(true); setForm({ name: savedAddress.name, street: '', city: '', state: '', pincode: '', phone: '' }); }}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 12,
                    border: '2px dashed var(--pink-light)', background: 'white',
                    cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 600,
                    fontSize: '0.88rem', color: 'var(--text-light)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--pink)'; e.currentTarget.style.color = 'var(--pink-dark)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pink-light)'; e.currentTarget.style.color = 'var(--text-light)'; }}>
                  + Use a different address
                </button>
              </div>
            )}

            {/* Address form — show if no saved address OR editing */}
            {(!savedAddress || editingAddress) && (
              <div>
                {editingAddress && (
                  <button onClick={() => setEditingAddress(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pink-dark)', fontWeight: 700, fontFamily: 'Nunito', fontSize: '0.88rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    ← Use default address
                  </button>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <input className="input" name="name" placeholder="Full Name" value={form.name} onChange={handle} />
                  <input className="input" name="phone" placeholder="Phone Number" value={form.phone} onChange={handle} />
                  <input className="input" name="street" placeholder="Street Address" value={form.street} onChange={handle} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <input className="input" name="city" placeholder="City" value={form.city} onChange={handle} />
                    <input className="input" name="state" placeholder="State" value={form.state} onChange={handle} />
                  </div>
                  <input className="input" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handle} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-light)' }}>
                    <input type="checkbox" defaultChecked
                      style={{ width: 16, height: 16, accentColor: 'var(--pink-dark)' }} />
                    Save as default address
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Payment */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', marginBottom: 20 }}>💳 Payment Method</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {['COD', 'Online'].map(method => (
                <label key={method} onClick={() => setPaymentMethod(method)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                    border: `2px solid ${paymentMethod === method ? 'var(--pink-dark)' : 'var(--pink-light)'}`,
                    borderRadius: 14, cursor: 'pointer',
                    background: paymentMethod === method ? 'var(--pink-light)' : 'white',
                    transition: 'all 0.2s',
                  }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: `3px solid ${paymentMethod === method ? 'var(--pink-dark)' : '#ccc'}`,
                    background: paymentMethod === method ? 'var(--pink-dark)' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {paymentMethod === method && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{method === 'COD' ? '💵 Cash on Delivery' : '📱 Online Payment (UPI)'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      {method === 'COD' ? 'Pay when you receive your order' : 'Pay via UPI QR code'}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod === 'Online' && (
              <div style={{ background: 'var(--pink-light)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                <p style={{ fontWeight: 700, marginBottom: 12 }}>Scan QR to Pay</p>
                <div style={{ width: 200, height: 200, margin: '0 auto 16px', background: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--pink)', overflow: 'hidden' }}>
                  <img src="/uploads/qr-code.jpg" alt="UPI QR Code"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                  <div style={{ display: 'none', padding: 12, fontSize: '0.82rem', color: 'var(--text-light)', textAlign: 'center' }}>
                    📱 Add qr-code.jpg to server/uploads/
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 12 }}>
                  Amount: <strong style={{ color: 'var(--pink-dark)' }}>₹{orderTotal}</strong>
                </p>
                <input className="input" placeholder="Enter UTR / Transaction ID after payment"
                  value={utrNumber} onChange={e => setUtrNumber(e.target.value)} />
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div>
          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow)', position: 'sticky', top: 90 }}>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', marginBottom: 20 }}>🧾 Order Summary</h2>

            <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 20 }}>
              {cart.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
                  <img src={item.images?.[0] || 'https://via.placeholder.com/56?text=🌸'} alt={item.name}
                    style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Qty: {item.qty}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--pink-dark)' }}>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '2px dashed var(--pink-light)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.95rem' }}>
                <span>Subtotal</span><span>₹{total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.95rem' }}>
                <span>Delivery</span>
                <span>
                  {actualDelivery === 0
                    ? <span style={{ color: '#38a169', fontWeight: 700 }}>FREE 🎉</span>
                    : `₹${actualDelivery}`}
                </span>
              </div>
              {actualDelivery > 0 && (
                <div style={{ background: 'var(--pink-light)', borderRadius: 10, padding: '8px 12px', marginBottom: 10, fontSize: '0.82rem', color: 'var(--pink-dark)', fontWeight: 600 }}>
                  🚚 Add ₹{freeAbove - total} more for FREE delivery!
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontWeight: 700, fontSize: '1.2rem', color: 'var(--pink-dark)', fontFamily: 'Playfair Display' }}>
                <span>Total</span><span>₹{orderTotal}</span>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 10, padding: '10px 14px', color: '#e53e3e', margin: '16px 0', fontSize: '0.9rem' }}>
                ❌ {error}
              </div>
            )}

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8 }}
              onClick={placeOrder} disabled={loading}>
              {loading ? '⏳ Placing Order...' : '✨ Place Order'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-light)', marginTop: 12 }}>
              🔒 Safe & Secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
