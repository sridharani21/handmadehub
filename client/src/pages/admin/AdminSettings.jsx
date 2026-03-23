import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryCharge, setDeliveryCharge] = useState(50);
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState(500);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return; }
    api.get('/settings').then(r => {
      setDeliveryCharge(r.data.deliveryCharge);
      setFreeDeliveryAbove(r.data.freeDeliveryAbove);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/settings', { deliveryCharge, freeDeliveryAbove });
      setMsg({ text: '✅ Settings saved successfully!', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: '❌ Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
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
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: 6 }}>⚙️ Shop Settings</h1>
        <p style={{ color: 'var(--text-light)' }}>Manage your delivery charges and other settings</p>
      </div>

      {msg.text && (
        <div style={{
          padding: '12px 18px', borderRadius: 12, marginBottom: 24,
          background: msg.type === 'success' ? '#c6f6d5' : '#fed7d7',
          color: msg.type === 'success' ? '#22543d' : '#742a2a',
          fontWeight: 600,
        }}>
          {msg.text}
        </div>
      )}

      {/* Delivery Settings Card */}
      <div style={{ background: 'white', borderRadius: 20, padding: 32, boxShadow: 'var(--shadow)', maxWidth: 560, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--pink-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            🚚
          </div>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', marginBottom: 2 }}>Delivery Charges</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Set delivery fee and free delivery threshold</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Delivery Charge */}
          <div>
            <label style={{ fontWeight: 700, marginBottom: 6, display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Delivery Charge (₹)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-light)' }}>₹</span>
              <input
                className="input"
                type="number"
                min="0"
                value={deliveryCharge}
                onChange={e => setDeliveryCharge(Number(e.target.value))}
                style={{ paddingLeft: 32 }}
              />
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: 6 }}>
              This amount is added to every order as delivery fee
            </p>
          </div>

          {/* Free Delivery Above */}
          <div>
            <label style={{ fontWeight: 700, marginBottom: 6, display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Free Delivery Above (₹)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-light)' }}>₹</span>
              <input
                className="input"
                type="number"
                min="0"
                value={freeDeliveryAbove}
                onChange={e => setFreeDeliveryAbove(Number(e.target.value))}
                style={{ paddingLeft: 32 }}
              />
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: 6 }}>
              Orders above this amount get free delivery. Set to 0 to always charge delivery.
            </p>
          </div>

          {/* Preview */}
          <div style={{ background: 'var(--pink-light)', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontWeight: 700, marginBottom: 10, fontSize: '0.9rem' }}>📋 Preview</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-light)' }}>Order below ₹{freeDeliveryAbove}</span>
                <span style={{ fontWeight: 700, color: 'var(--pink-dark)' }}>+ ₹{deliveryCharge} delivery</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-light)' }}>Order ₹{freeDeliveryAbove} and above</span>
                <span style={{ fontWeight: 700, color: '#38a169' }}>FREE delivery 🎉</span>
              </div>
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={save} disabled={saving}
          style={{ marginTop: 24, padding: '12px 32px' }}>
          {saving ? '⏳ Saving...' : '💾 Save Settings'}
        </button>
      </div>
    </div>
  );
}
