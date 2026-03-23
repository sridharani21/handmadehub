import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, revenue: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return; }
    Promise.all([api.get('/products'), api.get('/orders'), api.get('/users')]).then(([p, o, u]) => {
      const orders = o.data;
      const revenue = orders.filter(x => x.paymentStatus === 'Paid').reduce((s, x) => s + x.totalAmount, 0);
      setStats({
        products: p.data.length,
        orders: orders.length,
        pending: orders.filter(x => x.orderStatus === 'Processing').length,
        revenue,
        users: u.data.length,
      });
      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const STATUS_COLORS = {
    Processing: { bg: '#fefcbf', color: '#744210' },
    Shipped: { bg: '#bee3f8', color: '#2c5282' },
    Delivered: { bg: '#c6f6d5', color: '#22543d' },
    Cancelled: { bg: '#fed7d7', color: '#742a2a' },
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🌸</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: 6 }}>⚙️ Admin Panel</h1>
        <p style={{ color: 'var(--text-light)' }}>Welcome back, {user.name}! Here's your shop overview.</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 40 }}>
        {[
          { icon: '🛍️', label: 'Total Products', value: stats.products, color: 'var(--pink)', link: '/admin/products' },
          { icon: '📦', label: 'Total Orders', value: stats.orders, color: 'var(--lavender)', link: '/admin/orders' },
          { icon: '⏳', label: 'Pending Orders', value: stats.pending, color: 'var(--peach)', link: '/admin/orders' },
          { icon: '👥', label: 'Total Users', value: stats.users, color: 'var(--mint)', link: '/admin/users' },
          { icon: '💰', label: 'Revenue (Paid)', value: `₹${stats.revenue}`, color: '#b794f4', link: '/admin/orders' },
        ].map(({ icon, label, value, color, link }) => (
          <Link key={label} to={link} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white', borderRadius: 20, padding: 24,
              boxShadow: 'var(--shadow)', borderTop: `4px solid ${color}`,
              transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>{icon}</div>
              <div style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', fontWeight: 700, color: 'var(--brown)', marginBottom: 4 }}>{value}</div>
              <div style={{ color: 'var(--text-light)', fontWeight: 600, fontSize: '0.85rem' }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
        <Link to="/admin/products">
          <button className="btn-primary" style={{ padding: '12px 24px' }}>📦 Products</button>
        </Link>
        <Link to="/admin/orders">
          <button className="btn-outline" style={{ padding: '12px 24px' }}>🧾 Orders</button>
        </Link>
        <Link to="/admin/users">
          <button className="btn-outline" style={{ padding: '12px 24px' }}>👥 Users</button>
        </Link>
        <Link to="/admin/settings">
          <button className="btn-outline" style={{ padding: '12px 24px' }}>⚙️ Settings</button>
        </Link>
        <Link to="/shop">
          <button className="btn-outline" style={{ padding: '12px 24px' }}>🌸 View Shop</button>
        </Link>
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <div style={{
          padding: '16px 24px', background: 'linear-gradient(135deg, var(--pink-light), white)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '2px solid var(--pink-light)',
        }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem' }}>Recent Orders</h2>
          <Link to="/admin/orders" style={{ color: 'var(--pink-dark)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
            View All →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>No orders yet</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--pink-light)' }}>
                  {['Order ID', 'Customer', 'Amount', 'Payment', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o._id} style={{ borderBottom: '1px solid var(--pink-light)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--pink-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.85rem' }}>#{o._id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.9rem' }}>{o.user?.name || 'N/A'}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--pink-dark)' }}>₹{o.totalAmount}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700, background: o.paymentMethod === 'COD' ? '#fefcbf' : '#e6f7ff', color: o.paymentMethod === 'COD' ? '#744210' : '#1a365d' }}>
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ ...STATUS_COLORS[o.orderStatus], padding: '4px 12px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700 }}>
                        {o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
