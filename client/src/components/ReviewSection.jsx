import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

export default function ReviewSection({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/reviews/${productId}`).then(r => setReviews(r.data));
  }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post(`/reviews/${productId}`, { rating, comment });
      setReviews(prev => [res.data, ...prev]);
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: 24 }}>
        Customer Reviews 💬
      </h2>

      {/* Review Form */}
      {user ? (
        <form onSubmit={submit} style={{
          background: 'var(--pink-light)',
          borderRadius: 20, padding: 24, marginBottom: 32,
          border: '2px solid var(--pink)',
        }}>
          <h3 style={{ fontFamily: 'Playfair Display', marginBottom: 16 }}>Write a Review</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Your Rating</label>
            <StarRating rating={rating} interactive onRate={setRating} size="lg" />
          </div>
          <textarea
            className="input"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this item..."
            rows={4}
            required
            style={{ resize: 'vertical', marginBottom: 12 }}
          />
          {error && <p style={{ color: '#e53e3e', marginBottom: 12 }}>{error}</p>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Review ✨'}
          </button>
        </form>
      ) : (
        <div style={{
          background: 'var(--pink-light)', borderRadius: 16, padding: 20,
          textAlign: 'center', marginBottom: 32,
        }}>
          <p style={{ fontWeight: 600 }}>Please <a href="/login" style={{ color: 'var(--pink-dark)' }}>login</a> to write a review 💝</p>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No reviews yet. Be the first! 🌸</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.map(r => (
            <div key={r._id} style={{
              background: 'white', borderRadius: 16, padding: 20,
              boxShadow: '0 2px 12px rgba(249,168,201,0.15)',
              border: '1px solid var(--pink-light)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--pink), var(--lavender))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700,
                  }}>
                    {r.userName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{r.userName}</div>
                    <StarRating rating={r.rating} size="sm" />
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p style={{ color: 'var(--text)', lineHeight: 1.7 }}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
