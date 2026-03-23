import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = {
  Processing: { bg: '#fefcbf', color: '#744210' },
  Shipped: { bg: '#bee3f8', color: '#2c5282' },
  Delivered: { bg: '#c6f6d5', color: '#22543d' },
  Cancelled: { bg: '#fed7d7', color: '#742a2a' },
};

export default function AdminOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return; }
    load();
  }, []);

  const load = () => api.get('/orders').then(r => { setOrders(r.data); setLoading(false); });

  const update = async (id, data) => {
    await api.put(`/orders/${id}`, data);
    load();
  };

  const STATUSES = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filtered = filter === 'All' ? orders : orders.filter(o => o.orderStatus === filter);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🌸</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: 6 }}>🧾 All Orders</h1>
        <p style={{ color: 'var(--text-light)' }}>{orders.length} total orders</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{
              padding: '8px 20px', borderRadius: 50,
              border: filter === s ? '2px solid var(--pink-dark)' : '2px solid var(--pink-light)',
              background: filter === s ? 'var(--pink-dark)' : 'white',
              color: filter === s ? 'white' : 'var(--text)',
              fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito',
              transition: 'all 0.2s', fontSize: '0.9rem',
            }}>
            {s}
            <span style={{
              marginLeft: 6, background: filter === s ? 'rgba(255,255,255,0.3)' : 'var(--pink-light)',
              color: filter === s ? 'white' : 'var(--pink-dark)',
              borderRadius: 50, padding: '1px 7px', fontSize: '0.75rem',
            }}>
              {s === 'All' ? orders.length : orders.filter(o => o.orderStatus === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Orders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: 20, color: 'var(--text-light)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
            <div style={{ fontWeight: 600 }}>No orders in this category</div>
          </div>
        ) : filtered.map(o => (
          <div key={o._id} style={{
            background: 'white', borderRadius: 20,
            boxShadow: 'var(--shadow)', overflow: 'hidden',
            border: expanded === o._id ? '2px solid var(--pink)' : '2px solid transparent',
            transition: 'border 0.2s',
          }}>
            {/* Order Header */}
            <div
              style={{ padding: '18px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}
              onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, marginBottom: 2 }}>ORDER ID</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>#{o._id.slice(-8).toUpperCase()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, marginBottom: 2 }}>CUSTOMER</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{o.user?.name || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, marginBottom: 2 }}>DATE</div>
                  <div style={{ fontSize: '0.85rem' }}>
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, marginBottom: 2 }}>AMOUNT</div>
                  <div style={{ fontWeight: 700, color: 'var(--pink-dark)' }}>₹{o.totalAmount}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  ...STATUS_COLORS[o.orderStatus],
                  padding: '5px 14px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 700,
                }}>
                  {o.orderStatus}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  {expanded === o._id ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {/* Expanded Details */}
            {expanded === o._id && (
              <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--pink-light)', paddingTop: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

                  {/* Order Items */}
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-light)' }}>
                      Items Ordered
                    </h3>
                    {o.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                        <img src={item.image || 'https://via.placeholder.com/48?text=🌸'} alt={item.name}
                          style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>x{item.quantity} · ₹{item.price} each</div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--pink-dark)' }}>₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-light)' }}>
                      Shipping Address
                    </h3>
                    <div style={{ background: 'var(--pink-light)', borderRadius: 12, padding: '14px 16px', fontSize: '0.9rem', lineHeight: 1.8 }}>
                      <strong>{o.shippingAddress?.name}</strong><br />
                      {o.shippingAddress?.street}<br />
                      {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode}<br />
                      📞 {o.shippingAddress?.phone}
                    </div>

                    {/* Payment info */}
                    <div style={{ marginTop: 14, background: '#f0fff4', borderRadius: 12, padding: '12px 16px', fontSize: '0.85rem' }}>
                      <div><strong>Payment:</strong> {o.paymentMethod}</div>
                      <div><strong>Status:</strong> <span style={{ color: o.paymentStatus === 'Paid' ? '#38a169' : '#e53e3e', fontWeight: 700 }}>{o.paymentStatus}</span></div>
                      {o.utrNumber && <div><strong>UTR:</strong> {o.utrNumber}</div>}
                    </div>
                  </div>

                  {/* Update Controls */}
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-light)' }}>
                      Update Order
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', fontSize: '0.85rem' }}>Order Status</label>
                        <select className="input" value={o.orderStatus}
                          onChange={e => update(o._id, { orderStatus: e.target.value, paymentStatus: o.paymentStatus })}>
                          {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', fontSize: '0.85rem' }}>Payment Status</label>
                        <select className="input" value={o.paymentStatus}
                          onChange={e => update(o._id, { orderStatus: o.orderStatus, paymentStatus: e.target.value })}>
                          {['Pending', 'Paid'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 18px' }}
                          onClick={() => update(o._id, { orderStatus: 'Shipped', paymentStatus: o.paymentStatus })}>
                          🚚 Mark Shipped
                        </button>
                        <button className="btn-outline" style={{ fontSize: '0.85rem', padding: '8px 18px' }}
                          onClick={() => update(o._id, { orderStatus: 'Delivered', paymentStatus: 'Paid' })}>
                          ✅ Delivered & Paid
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
