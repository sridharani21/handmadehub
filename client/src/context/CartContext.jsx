import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i => i._id === action.item._id);
      if (exists) return state.map(i => i._id === action.item._id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'REMOVE': return state.filter(i => i._id !== action.id);
    case 'UPDATE_QTY': return state.map(i => i._id === action.id ? { ...i, qty: action.qty } : i);
    case 'CLEAR': return [];
    default: return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer,
    JSON.parse(localStorage.getItem('cart') || '[]'));

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);

  const addToCart = (item) => dispatch({ type: 'ADD', item });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE', id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
