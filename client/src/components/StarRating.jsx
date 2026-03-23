export default function StarRating({ rating = 0, count, size = 'md', interactive = false, onRate }) {
  const stars = [1, 2, 3, 4, 5];
  const fontSize = size === 'sm' ? '0.85rem' : size === 'lg' ? '1.4rem' : '1rem';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {stars.map(s => (
          <span
            key={s}
            className={s <= Math.round(rating) ? 'star' : 'star-empty'}
            style={{ fontSize, cursor: interactive ? 'pointer' : 'default', transition: 'transform 0.1s' }}
            onClick={() => interactive && onRate?.(s)}
            onMouseEnter={e => interactive && (e.target.style.transform = 'scale(1.3)')}
            onMouseLeave={e => interactive && (e.target.style.transform = 'scale(1)')}
          >
            ★
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: 4 }}>
          ({count})
        </span>
      )}
    </div>
  );
}
