import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/auth/wishlist').then(r => setWishlist(r.data.map(p => p._id)));
    } else {
      setWishlist([]);
    }
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) return false;
    const res = await api.post(`/auth/wishlist/${productId}`);
    setWishlist(res.data.wishlist);
    return true;
  };

  const isWishlisted = (id) => wishlist.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
