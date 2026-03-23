import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'linear-gradient(135deg, var(--pink-light), #f0f9ff)',
    }}>
      <div style={{
        background: 'white', borderRadius: 32, padding: '60px 48px', textAlign: 'center',
        maxWidth: 500, width: '100%', boxShadow: '0 20px 60px rgba(249,168,201,0.3)',
        animation: 'fadeUp 0.5s ease',
      }}>
        <style>{`
          @keyframes bounce { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.2) } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
        `}</style>

        <div style={{ fontSize: '5rem', marginBottom: 16, animation: 'bounce 1s ease 0.5s' }}>🎉</div>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', fontWeight: 700, marginBottom: 12, color: 'var(--brown)' }}>
          Order Placed!
        </h1>
        <p style={{ color: 'var(--text-light)', lineHeight: 1.7, marginBottom: 32, fontSize: '1rem' }}>
          Thank you so much for your order! 🌸<br />
          We'll start crafting your special item and ship it soon.<br />
          You'll receive updates on your email.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/orders')}>
            📦 Track My Orders
          </button>
          <button className="btn-outline" onClick={() => navigate('/shop')}>
            🛍️ Continue Shopping
          </button>
        </div>

        <div style={{ marginTop: 32, padding: 16, background: 'var(--pink-light)', borderRadius: 16 }}>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>💌 Order Confirmation</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: 4 }}>
            A confirmation will be sent to your registered email.
          </p>
        </div>
      </div>
    </div>
  );
}
