import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Package, TrendingUp, Users, Plus, Trash2, Edit, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Product, Order } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
  const { products, orders, addProduct, deleteProduct, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [isEditing, setIsEditing] = useState(false); // Simplified: only adding new products
  
  // New Product State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', category: 'T-Shirts', price: 0, description: '', images: [], sizes: ['S', 'M', 'L'], colors: ['Black'], weightKg: 0.5
  });

  const stats = {
    revenue: orders.reduce((acc, order) => acc + order.totalAmount, 0),
    totalOrders: orders.length,
    products: products.length
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newProduct.name || !newProduct.price) return;

    const p: Product = {
      id: `${Date.now()}`,
      name: newProduct.name!,
      description: newProduct.description || '',
      price: Number(newProduct.price),
      category: newProduct.category as any,
      images: newProduct.images?.length ? newProduct.images : ['https://picsum.photos/400/500'],
      sizes: newProduct.sizes || ['S', 'M', 'L'],
      colors: newProduct.colors || ['Black'],
      inStock: true,
      weightKg: Number(newProduct.weightKg) || 0.5,
    };
    addProduct(p);
    setIsEditing(false);
    setNewProduct({ name: '', category: 'T-Shirts', price: 0, description: '', weightKg: 0.5 });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-dark p-6 rounded-xl border border-brand-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-muted text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-white">{stats.revenue.toLocaleString()} RUB</h3>
            </div>
            <TrendingUp className="text-brand-red h-8 w-8" />
          </div>
        </div>
        <div className="bg-brand-dark p-6 rounded-xl border border-brand-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-muted text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalOrders}</h3>
            </div>
            <Package className="text-brand-red h-8 w-8" />
          </div>
        </div>
        <div className="bg-brand-dark p-6 rounded-xl border border-brand-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-muted text-sm">Active Products</p>
              <h3 className="text-2xl font-bold text-white">{stats.products}</h3>
            </div>
            <Users className="text-brand-red h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="bg-brand-dark p-6 rounded-xl border border-brand-gray h-80">
        <h3 className="text-lg font-bold text-white mb-4">Orders Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { name: 'New', count: orders.filter(o => o.status === 'New').length },
            { name: 'Paid', count: orders.filter(o => o.status === 'Paid').length },
            { name: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
            { name: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#333', color: '#fff' }} />
            <Bar dataKey="count" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Product Management</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-brand-red hover:bg-brand-redHover text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleAddProduct} className="bg-brand-dark p-6 rounded-xl border border-brand-gray space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Product Name" required
              value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              className="bg-brand-black border border-brand-gray p-3 rounded-lg text-white w-full"
            />
            <input 
              type="number" placeholder="Price (RUB)" required
              value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
              className="bg-brand-black border border-brand-gray p-3 rounded-lg text-white w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <select 
              value={newProduct.category} 
              onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}
              className="bg-brand-black border border-brand-gray p-3 rounded-lg text-white w-full"
            >
              <option value="T-Shirts">T-Shirts</option>
              <option value="Hoodies">Hoodies</option>
              <option value="Pants">Pants</option>
              <option value="Dresses">Dresses</option>
              <option value="Accessories">Accessories</option>
            </select>
            <input 
              type="number" placeholder="Weight (kg)" required step="0.1"
              value={newProduct.weightKg || ''} onChange={e => setNewProduct({...newProduct, weightKg: Number(e.target.value)})}
              className="bg-brand-black border border-brand-gray p-3 rounded-lg text-white w-full"
            />
          </div>
          <textarea 
            placeholder="Description"
            value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
            className="bg-brand-black border border-brand-gray p-3 rounded-lg text-white w-full h-24"
          />
          <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200">Save Product</button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-brand-dark p-4 rounded-lg flex justify-between items-center border border-brand-gray">
            <div className="flex items-center gap-4">
              <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded" />
              <div>
                <h4 className="font-bold text-white">{product.name}</h4>
                <p className="text-sm text-brand-muted">{product.price} RUB | {product.category}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => deleteProduct(product.id)} className="p-2 text-brand-red hover:bg-brand-black rounded">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Orders</h2>
      <div className="space-y-4">
        {orders.length === 0 ? <p className="text-brand-muted">No orders yet.</p> : orders.map(order => (
          <div key={order.id} className="bg-brand-dark p-6 rounded-xl border border-brand-gray">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4 border-b border-brand-gray pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-brand-red font-bold">{order.id}</span>
                  <span className="text-brand-muted text-sm">{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-white mt-1">{order.userDetails.fullName}</h4>
                <p className="text-sm text-brand-muted">{order.userDetails.phone} | {order.userDetails.email}</p>
                <p className="text-sm text-brand-muted">{order.userDetails.country}, {order.userDetails.city}, {order.userDetails.address}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'Delivered' ? 'bg-green-900 text-green-300' :
                  order.status === 'Shipped' ? 'bg-blue-900 text-blue-300' :
                  order.status === 'Paid' ? 'bg-yellow-900 text-yellow-300' : 'bg-gray-800 text-gray-300'
                }`}>
                  {order.status.toUpperCase()}
                </span>
                <div className="text-right">
                  <p className="text-sm text-brand-muted">Method: {order.delivery.method.name}</p>
                  <p className="font-bold text-white text-lg">Total: {order.totalAmount} RUB</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-white mb-2">Items:</h5>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-brand-muted">
                    <span>{item.name} ({item.selectedSize}, {item.selectedColor}) x{item.quantity}</span>
                    <span>{item.price * item.quantity} RUB</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
               {['Paid', 'Shipped', 'Delivered'].map((status) => (
                 <button
                   key={status}
                   onClick={() => updateOrderStatus(order.id, status as any)}
                   className={`px-3 py-1 text-xs rounded border border-brand-gray hover:bg-brand-gray ${order.status === status ? 'bg-brand-red border-brand-red text-white' : 'text-brand-muted'}`}
                 >
                   Mark {status}
                 </button>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-black flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-brand-gray bg-brand-dark/50 hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white hidden md:block">ADMIN</h2>
        </div>
        <nav className="mt-6 space-y-2 px-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-brand-red text-white' : 'text-brand-muted hover:text-white hover:bg-brand-gray'}`}>
            <TrendingUp className="h-5 w-5" /> <span className="hidden md:block">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-brand-red text-white' : 'text-brand-muted hover:text-white hover:bg-brand-gray'}`}>
            <Package className="h-5 w-5" /> <span className="hidden md:block">Products</span>
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-brand-red text-white' : 'text-brand-muted hover:text-white hover:bg-brand-gray'}`}>
            <Users className="h-5 w-5" /> <span className="hidden md:block">Orders</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex mb-6 gap-2">
           <button onClick={() => setActiveTab('dashboard')} className={`flex-1 py-2 text-sm font-bold rounded ${activeTab === 'dashboard' ? 'bg-brand-red text-white' : 'bg-brand-gray text-brand-muted'}`}>Dash</button>
           <button onClick={() => setActiveTab('products')} className={`flex-1 py-2 text-sm font-bold rounded ${activeTab === 'products' ? 'bg-brand-red text-white' : 'bg-brand-gray text-brand-muted'}`}>Prod</button>
           <button onClick={() => setActiveTab('orders')} className={`flex-1 py-2 text-sm font-bold rounded ${activeTab === 'orders' ? 'bg-brand-red text-white' : 'bg-brand-gray text-brand-muted'}`}>Orders</button>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
      </main>
    </div>
  );
};