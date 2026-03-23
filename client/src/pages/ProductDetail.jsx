import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ReviewSection from '../components/ReviewSection';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const { toasts, showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data));
  }, [id]);

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🌸</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  const handleAddToCart = () => {
    if (product.isOutOfStock) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    showToast(`${qty} item${qty > 1 ? 's' : ''} added to cart! 🛒`);
  };

  const handleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    await toggleWishlist(product._id);
    showToast(isWishlisted(product._id) ? 'Removed from wishlist' : 'Added to wishlist! 💝');
  };

  const images = product.images?.length ? product.images : ['https://via.placeholder.com/600x500?text=🌸'];

  return (
    <div className="page">
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, fontSize: '0.9rem', color: 'var(--text-light)' }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span> /
        <span onClick={() => navigate('/shop')} style={{ cursor: 'pointer', margin: '0 6px' }}>Shop</span> /
        <span style={{ color: 'var(--pink-dark)', fontWeight: 600 }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, marginBottom: 48 }}>
        {/* Images */}
        <div>
          <div style={{
            borderRadius: 24, overflow: 'hidden', marginBottom: 12,
            height: 420, background: 'var(--pink-light)', position: 'relative'
          }}>
            <img src={images[activeImg]} alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {product.isOutOfStock && (
              <div className="out-of-stock-overlay">
                <span className="out-of-stock-label">Out of Stock</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 10 }}>
              {images.map((img, i) => (
                <img key={i} src={img} alt={`view ${i}`}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 72, height: 72, borderRadius: 12, objectFit: 'cover', cursor: 'pointer',
                    border: i === activeImg ? '3px solid var(--pink-dark)' : '3px solid transparent',
                    transition: 'border 0.2s',
                  }} />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="tag" style={{ marginBottom: 12, display: 'inline-block' }}>{product.category}</span>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>
            {product.name}
          </h1>

          <div style={{ marginBottom: 16 }}>
            <StarRating rating={product.averageRating} count={product.numReviews} size="md" />
          </div>

          <div style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', fontWeight: 700, color: 'var(--pink-dark)', marginBottom: 20 }}>
            ₹{product.price}
          </div>

          <p style={{ color: 'var(--text-light)', lineHeight: 1.8, marginBottom: 24, fontSize: '1rem' }}>
            {product.description}
          </p>

          {/* Qty selector */}
          {!product.isOutOfStock && (
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 700, marginBottom: 10, display: 'block' }}>Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid var(--pink)', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem' }}>−</button>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', minWidth: 30, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)}
                  style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid var(--pink)', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem' }}>+</button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <button
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}
              onClick={handleAddToCart}
              disabled={product.isOutOfStock}
            >
              {product.isOutOfStock ? '😔 Out of Stock' : '🛒 Add to Cart'}
            </button>
            <button className="btn-outline" onClick={handleWishlist} style={{ padding: '12px 20px' }}>
              {isWishlisted(product._id) ? '❤️' : '🤍'}
            </button>
          </div>

          {!product.isOutOfStock && (
            <button className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #38a169, #2f855a)' }}
              onClick={() => { handleAddToCart(); navigate('/checkout'); }}>
              ⚡ Buy Now
            </button>
          )}

          {/* Info strips */}
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['🎁', 'Handmade with love'], ['🚚', 'Free shipping above ₹500'], ['↩️', '7-day easy returns'], ['✅', '100% authentic handmade']].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'var(--pink-light)', borderRadius: 12 }}>
                <span>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReviewSection productId={id} />
      <Toast toasts={toasts} />
    </div>
  );
}
