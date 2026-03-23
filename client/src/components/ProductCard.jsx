import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

export default function ProductCard({ product, onToast }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.isOutOfStock) return;
    addToCart(product);
    onToast?.('Added to cart! 🛒');
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    const done = await toggleWishlist(product._id);
    if (done) onToast?.(isWishlisted(product._id) ? 'Removed from wishlist' : 'Added to wishlist! 💝');
  };

  return (
    <div className="card" onClick={() => navigate(`/product/${product._id}`)}
      style={{ cursor: 'pointer', position: 'relative' }}>

      {/* Image */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: 'var(--pink-light)' }}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300x220?text=🌸'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />

        {/* Out of stock */}
        {product.isOutOfStock && (
          <div className="out-of-stock-overlay">
            <span className="out-of-stock-label">Out of Stock</span>
          </div>
        )}

        {/* Wishlist button */}
        <button onClick={handleWishlist}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'white', border: 'none', borderRadius: '50%',
            width: 36, height: 36, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: '1.1rem', transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isWishlisted(product._id) ? '❤️' : '🤍'}
        </button>

        {/* Category tag */}
        <span style={{
          position: 'absolute', bottom: 10, left: 10,
          background: 'white', color: 'var(--pink-dark)',
          padding: '3px 12px', borderRadius: 50,
          fontSize: '0.75rem', fontWeight: 700,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1rem', fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>
          {product.name}
        </h3>

        <StarRating rating={product.averageRating} count={product.numReviews} size="sm" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', fontWeight: 700, color: 'var(--pink-dark)' }}>
            ₹{product.price}
          </span>
          <button
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={handleAddToCart}
            disabled={product.isOutOfStock}
          >
            {product.isOutOfStock ? 'Sold Out' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
