import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, UserDetails, DeliveryOption } from '../types';
import { INITIAL_PRODUCTS, notifyAdmin } from '../services/mockApi';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (userDetails: UserDetails, delivery: { method: DeliveryOption; cost: number }) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  // Initialize state from LocalStorage or Defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('topstore_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('topstore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('topstore_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => { localStorage.setItem('topstore_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('topstore_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('topstore_orders', JSON.stringify(orders)); }, [orders]);

  // Actions
  const addProduct = (product: Product) => setProducts([...products, product]);
  
  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addToCart = (product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => item.cartId === existing.cartId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, selectedSize: size, selectedColor: color, quantity: 1, cartId: `${Date.now()}` }];
    });
  };

  const removeFromCart = (cartId: string) => setCart(prev => prev.filter(item => item.cartId !== cartId));

  const updateCartQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const createOrder = async (userDetails: UserDetails, delivery: { method: DeliveryOption; cost: number }) => {
    const itemsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'Paid', // Assuming instant payment success in this demo
      items: [...cart],
      userDetails,
      delivery,
      totalAmount: itemsTotal + delivery.cost
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    
    // Simulate Backend Notification
    notifyAdmin(newOrder);
    
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <StoreContext.Provider value={{
      products, cart, orders,
      addProduct, updateProduct, deleteProduct,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      createOrder, updateOrderStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};