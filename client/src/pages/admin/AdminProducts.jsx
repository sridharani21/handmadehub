import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Crochet', 'Jewelry', 'Candles', 'Bags', 'Home Decor', 'Keychains', 'Cards', 'Other'];

export default function AdminProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Crochet', stock: 10 });
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', category: '', stock: 0 });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return; }
    load();
  }, []);

  const load = () => {
    api.get('/products').then(r => { setProducts(r.data); setLoading(false); });
  };

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEdit = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const openEdit = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  };

  const closeEdit = () => {
    setEditProduct(null);
  };

  const saveEdit = async () => {
    setSubmitting(true);
    try {
      await api.put(`/products/${editProduct._id}`, editForm);
      setMsg({ text: '✅ Product updated successfully!', type: 'success' });
      closeEdit();
      load();
    } catch (err) {
      setMsg({ text: '❌ ' + (err.response?.data?.message || 'Failed to update'), type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const submit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ text: '', type: '' });
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach(f => fd.append('images', f));
    try {
      await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg({ text: '✅ Product added successfully!', type: 'success' });
      setForm({ name: '', description: '', price: '', category: 'Crochet', stock: 10 });
      setFiles([]);
      setShowAddForm(false);
      load();
    } catch (err) {
      setMsg({ text: '❌ ' + (err.response?.data?.message || 'Failed to add product'), type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await api.delete(`/products/${id}`);
    setMsg({ text: `🗑️ "${name}" deleted`, type: 'success' });
    load();
  };

  const toggleStock = async (id) => {
    await api.patch(`/products/${id}/stock`);
    load();
  };

  const updateStockNumber = async (id, newStock) => {
    await api.put(`/products/${id}`, { stock: parseInt(newStock) });
    load();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🌸</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <div className="page">

      {/* ===== EDIT MODAL ===== */}
      {editProduct && (
        <>
          <div className="overlay" onClick={closeEdit} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white', borderRadius: 24, padding: 32,
            width: 'min(560px, 95vw)', zIndex: 300,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem' }}>✏️ Edit Product</h2>
              <button onClick={closeEdit} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)', lineHeight: 1 }}>✕</button>
            </div>

            {editProduct.images?.[0] && (
              <img src={editProduct.images[0]} alt={editProduct.name}
                style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 14, marginBottom: 20 }} />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 5, display: 'block', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Name</label>
                <input className="input" name="name" value={editForm.name} onChange={handleEdit} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 5, display: 'block', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price (₹)</label>
                  <input className="input" name="price" type="number" value={editForm.price} onChange={handleEdit} min="1" />
                </div>
                <div>
                  <label style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 5, display: 'block', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock Quantity</label>
                  <input className="input" name="stock" type="number" value={editForm.stock} onChange={handleEdit} min="0" />
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 5, display: 'block', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                <select className="input" name="category" value={editForm.category} onChange={handleEdit}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 5, display: 'block', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</label>
                <textarea className="input" name="description" value={editForm.description} onChange={handleEdit} rows={4} style={{ resize: 'vertical' }} />
              </div>

              {/* Stock Status Toggle inside modal */}
              <div style={{
                background: editProduct.isOutOfStock ? '#fff5f5' : '#f0fff4',
                border: `2px solid ${editProduct.isOutOfStock ? '#fed7d7' : '#c6f6d5'}`,
                borderRadius: 14, padding: '14px 18px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>Availability</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    Currently: <strong style={{ color: editProduct.isOutOfStock ? '#e53e3e' : '#38a169' }}>
                      {editProduct.isOutOfStock ? 'Out of Stock' : 'In Stock'}
                    </strong>
                  </div>
                </div>
                <button onClick={async () => {
                  await toggleStock(editProduct._id);
                  setEditProduct(prev => ({ ...prev, isOutOfStock: !prev.isOutOfStock }));
                }}
                  style={{
                    padding: '8px 16px', borderRadius: 50, cursor: 'pointer',
                    fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.85rem',
                    border: `2px solid ${editProduct.isOutOfStock ? '#c6f6d5' : '#fed7d7'}`,
                    background: 'white',
                    color: editProduct.isOutOfStock ? '#22543d' : '#742a2a',
                  }}>
                  {editProduct.isOutOfStock ? '✅ Mark In Stock' : '❌ Mark Out of Stock'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveEdit} disabled={submitting}>
                {submitting ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
              <button className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={closeEdit}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== PAGE HEADER ===== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: 6 }}>📦 Products</h1>
          <p style={{ color: 'var(--text-light)' }}>{products.length} products in your shop</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Message Banner */}
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

      {/* ===== ADD PRODUCT FORM ===== */}
      {showAddForm && (
        <div style={{ background: 'white', borderRadius: 20, padding: 28, marginBottom: 28, boxShadow: 'var(--shadow)', border: '2px solid var(--pink-light)' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', marginBottom: 20 }}>🌸 Add New Product</h2>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', fontSize: '0.9rem' }}>Product Name *</label>
                <input className="input" name="name" placeholder="e.g. Crochet Sunflower Bag" value={form.name} onChange={handle} required />
              </div>
              <div>
                <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', fontSize: '0.9rem' }}>Price (₹) *</label>
                <input className="input" name="price" type="number" placeholder="299" value={form.price} onChange={handle} required min="1" />
              </div>
              <div>
                <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', fontSize: '0.9rem' }}>Category *</label>
                <select className="input" name="category" value={form.category} onChange={handle}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', fontSize: '0.9rem' }}>Stock Quantity</label>
                <input className="input" name="stock" type="number" placeholder="10" value={form.stock} onChange={handle} min="0" />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', fontSize: '0.9rem' }}>Description *</label>
              <textarea className="input" name="description" placeholder="Describe your handmade product..." value={form.description} onChange={handle} rows={4} required style={{ resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', fontSize: '0.9rem' }}>Product Images (up to 5)</label>
              <div style={{ border: '2px dashed var(--pink)', borderRadius: 12, padding: 20, textAlign: 'center', background: 'var(--pink-light)' }}>
                <input type="file" multiple accept="image/*" id="file-upload" onChange={e => setFiles([...e.target.files])} style={{ display: 'none' }} />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📷</div>
                  <div style={{ fontWeight: 600, color: 'var(--pink-dark)' }}>
                    {files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload images'}
                  </div>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary" type="submit" disabled={submitting}>{submitting ? '⏳ Adding...' : '✨ Add Product'}</button>
              <button type="button" className="btn-outline" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input className="input" placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* ===== PRODUCTS GRID ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {filtered.map(p => (
          <div key={p._id} style={{ background: 'white', borderRadius: 20, boxShadow: 'var(--shadow)', overflow: 'hidden', border: '2px solid transparent', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--pink-light)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>

            {/* Image */}
            <div style={{ position: 'relative', height: 180, background: 'var(--pink-light)' }}>
              <img src={p.images?.[0] || 'https://via.placeholder.com/280x180?text=🌸'} alt={p.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {p.isOutOfStock && (
                <div style={{ position: 'absolute', top: 10, left: 10, background: '#e53e3e', color: 'white', padding: '4px 12px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700 }}>
                  Out of Stock
                </div>
              )}
              <span style={{ position: 'absolute', bottom: 10, right: 10, background: 'white', color: 'var(--pink-dark)', padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700 }}>
                {p.category}
              </span>
            </div>

            {/* Info */}
            <div style={{ padding: '16px 18px' }}>
              <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{p.name}</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', fontWeight: 700, color: 'var(--pink-dark)' }}>₹{p.price}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Stock:</span>
                  <input type="number" defaultValue={p.stock} min="0"
                    onBlur={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v !== p.stock) updateStockNumber(p._id, v); }}
                    style={{ width: 56, padding: '3px 6px', borderRadius: 8, border: '2px solid var(--pink-light)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = 'var(--pink-dark)'}
                    onBlurCapture={e => e.target.style.borderColor = 'var(--pink-light)'}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
                <span style={{ color: '#fbbf24' }}>★</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.averageRating || '—'}</span>
                <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>({p.numReviews} reviews)</span>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(p)}
                  style={{ flex: 1, padding: '9px 0', borderRadius: 50, border: '2px solid var(--pink)', background: 'var(--pink-light)', cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.85rem', color: 'var(--pink-dark)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.target.style.background = 'var(--pink)'; e.target.style.color = 'white'; }}
                  onMouseLeave={e => { e.target.style.background = 'var(--pink-light)'; e.target.style.color = 'var(--pink-dark)'; }}>
                  ✏️ Edit
                </button>
                <button onClick={() => toggleStock(p._id)}
                  style={{ flex: 1, padding: '9px 0', borderRadius: 50, border: `2px solid ${p.isOutOfStock ? '#c6f6d5' : '#fed7d7'}`, background: 'white', cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.85rem', color: p.isOutOfStock ? '#22543d' : '#742a2a', transition: 'all 0.2s' }}>
                  {p.isOutOfStock ? '✅ In Stock' : '❌ Out of Stock'}
                </button>
                <button onClick={() => deleteProduct(p._id, p.name)}
                  style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #fed7d7', background: 'white', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: 'white', borderRadius: 20, color: 'var(--text-light)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 600 }}>No products found</div>
          </div>
        )}
      </div>
    </div>
  );
}