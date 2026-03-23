import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [selectedUser, setSelectedUser] = useState(null); // for orders modal
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // user to delete

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return; }
    load();
  }, []);

  const load = () => {
    api.get('/users').then(r => { setUsers(r.data); setLoading(false); });
  };

  const deleteUser = async (u) => {
    try {
      await api.delete(`/users/${u._id}`);
      setMsg({ text: `🗑️ "${u.name}" has been removed`, type: 'success' });
      setConfirmDelete(null);
      load();
    } catch (err) {
      setMsg({ text: '❌ ' + (err.response?.data?.message || 'Failed to delete'), type: 'error' });
      setConfirmDelete(null);
    }
  };

  const toggleBlock = async (u) => {
    try {
      await api.patch(`/users/${u._id}/block`);
      setMsg({ text: u.isBlocked ? `✅ "${u.name}" unblocked` : `🚫 "${u.name}" blocked`, type: 'success' });
      load();
    } catch (err) {
      setMsg({ text: '❌ ' + (err.response?.data?.message || 'Failed'), type: 'error' });
    }
  };

  const viewOrders = async (u) => {
    setSelectedUser(u);
    setOrdersLoading(true);
    const res = await api.get(`/users/${u._id}/orders`);
    setUserOrders(res.data);
    setOrdersLoading(false);
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {confirmDelete && (
        <>
          <div className="overlay" onClick={() => setConfirmDelete(null)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white', borderRadius: 24, padding: 36,
            width: 'min(420px, 92vw)', zIndex: 300,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', marginBottom: 10 }}>
              Remove User?
            </h2>
            <p style={{ color: 'var(--text-light)', marginBottom: 6 }}>
              You are about to permanently delete:
            </p>
            <div style={{ background: 'var(--pink-light)', borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{confirmDelete.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{confirmDelete.email}</div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#e53e3e', marginBottom: 24, fontWeight: 600 }}>
              This cannot be undone. All user data will be lost.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-outline"
                style={{ flex: 1, justifyContent: 'center' }}>
                ✕ Cancel
              </button>
              <button
                onClick={() => deleteUser(confirmDelete)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 50,
                  background: 'linear-gradient(135deg, #e53e3e, #c53030)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.95rem',
                }}>
                🗑️ Yes, Delete
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== USER ORDERS MODAL ===== */}
      {selectedUser && (
        <>
          <div className="overlay" onClick={() => setSelectedUser(null)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white', borderRadius: 24, padding: 28,
            width: 'min(600px, 95vw)', zIndex: 300,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            maxHeight: '85vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', marginBottom: 2 }}>
                  📦 {selectedUser.name}'s Orders
                </h2>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{selectedUser.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)', lineHeight: 1 }}>
                ✕
              </button>
            </div>

            {ordersLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>🌸</div>
              </div>
            ) : userOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 10 }}>📭</div>
                <div style={{ fontWeight: 600 }}>No orders yet</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {userOrders.map(o => (
                  <div key={o._id} style={{ background: 'var(--cream)', borderRadius: 14, padding: '14px 18px', border: '1px solid var(--pink-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>#{o._id.slice(-8).toUpperCase()}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                          {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: 'var(--pink-dark)' }}>₹{o.totalAmount}</span>
                        <span style={{ ...STATUS_COLORS[o.orderStatus], padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700 }}>
                          {o.orderStatus}
                        </span>
                        <span style={{ padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, background: o.paymentMethod === 'COD' ? '#fefcbf' : '#e6f7ff', color: o.paymentMethod === 'COD' ? '#744210' : '#1a365d' }}>
                          {o.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
              onClick={() => setSelectedUser(null)}>
              Close
            </button>
          </div>
        </>
      )}

      {/* ===== PAGE HEADER ===== */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: 6 }}>👥 Users</h1>
        <p style={{ color: 'var(--text-light)' }}>{users.length} registered users</p>
      </div>

      {/* Message */}
      {msg.text && (
        <div style={{
          padding: '12px 18px', borderRadius: 12, marginBottom: 20,
          background: msg.type === 'success' ? '#c6f6d5' : '#fed7d7',
          color: msg.type === 'success' ? '#22543d' : '#742a2a',
          fontWeight: 600, display: 'flex', justifyContent: 'space-between',
        }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg({ text: '', type: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '👥', label: 'Total Users', value: users.length, color: 'var(--pink)' },
          { icon: '👑', label: 'Admins', value: users.filter(u => u.isAdmin).length, color: 'var(--lavender)' },
          { icon: '🚫', label: 'Blocked', value: users.filter(u => u.isBlocked).length, color: 'var(--peach)' },
          { icon: '✅', label: 'Active', value: users.filter(u => !u.isBlocked && !u.isAdmin).length, color: 'var(--mint)' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} style={{ background: 'white', borderRadius: 16, padding: '16px 20px', boxShadow: 'var(--shadow)', borderTop: `3px solid ${color}` }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{icon}</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: '1.6rem', fontWeight: 700, color: 'var(--brown)' }}>{value}</div>
            <div style={{ color: 'var(--text-light)', fontWeight: 600, fontSize: '0.85rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input className="input" placeholder="🔍 Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* ===== USERS TABLE ===== */}
      <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <div style={{ padding: '16px 24px', borderBottom: '2px solid var(--pink-light)', background: 'var(--pink-light)', fontWeight: 700 }}>
          All Users ({filtered.length})
        </div>

        {/* Desktop Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pink-light)', background: '#fafafa' }}>
                {['User', 'Email', 'Joined', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}
                  style={{ borderBottom: '1px solid var(--pink-light)', transition: 'background 0.15s', opacity: u.isBlocked ? 0.6 : 1 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fffaf9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  {/* Avatar + Name */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                        background: u.isAdmin
                          ? 'linear-gradient(135deg, #f6d365, #fda085)'
                          : 'linear-gradient(135deg, var(--pink), var(--lavender))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '1rem',
                      }}>
                        {u.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.name}</div>
                        {u.isAdmin && <div style={{ fontSize: '0.72rem', color: '#d69e2e', fontWeight: 700 }}>👑 Admin</div>}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ padding: '14px 16px', fontSize: '0.88rem', color: 'var(--text-light)' }}>
                    {u.email}
                  </td>

                  {/* Joined */}
                  <td style={{ padding: '14px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>

                  {/* Role */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700,
                      background: u.isAdmin ? '#fefcbf' : 'var(--pink-light)',
                      color: u.isAdmin ? '#744210' : 'var(--pink-dark)',
                    }}>
                      {u.isAdmin ? '👑 Admin' : '👤 Customer'}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700,
                      background: u.isBlocked ? '#fed7d7' : '#c6f6d5',
                      color: u.isBlocked ? '#742a2a' : '#22543d',
                    }}>
                      {u.isBlocked ? '🚫 Blocked' : '✅ Active'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>

                      {/* View Orders */}
                      <button onClick={() => viewOrders(u)}
                        style={{
                          padding: '6px 14px', borderRadius: 50, cursor: 'pointer',
                          border: '2px solid var(--pink-light)', background: 'white',
                          fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.78rem',
                          color: 'var(--text)', whiteSpace: 'nowrap', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--pink-light)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}>
                        📦 Orders
                      </button>

                      {/* Block / Unblock — only for non-admins */}
                      {!u.isAdmin && (
                        <button onClick={() => toggleBlock(u)}
                          style={{
                            padding: '6px 14px', borderRadius: 50, cursor: 'pointer',
                            border: `2px solid ${u.isBlocked ? '#c6f6d5' : '#fed7d7'}`,
                            background: 'white', fontFamily: 'Nunito', fontWeight: 700,
                            fontSize: '0.78rem', whiteSpace: 'nowrap',
                            color: u.isBlocked ? '#22543d' : '#742a2a', transition: 'all 0.15s',
                          }}>
                          {u.isBlocked ? '✅ Unblock' : '🚫 Block'}
                        </button>
                      )}

                      {/* Delete — only for non-admins */}
                      {!u.isAdmin && (
                        <button onClick={() => setConfirmDelete(u)}
                          style={{
                            width: 34, height: 34, borderRadius: '50%',
                            border: '2px solid #fed7d7', background: 'white',
                            cursor: 'pointer', fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}
                          title="Delete user">
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-light)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
                    <div style={{ fontWeight: 600 }}>No users found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
