import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Category, Product } from '../types';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Filter, Search, ArrowRight, Check } from 'lucide-react';

export const Catalog = () => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const categories: Category[] = ['All', 'T-Shirts', 'Hoodies', 'Pants', 'Dresses', 'Accessories'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">COLLECTION</h1>
          <p className="text-brand-muted">Discover the latest drop from TopStore.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-brand-dark border border-brand-gray rounded-full text-white text-sm focus:outline-none focus:border-brand-red w-full md:w-64"
            />
          </div>
          
          {/* Categories */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors border ${
                  selectedCategory === cat 
                    ? 'bg-brand-red border-brand-red text-white' 
                    : 'bg-transparent border-brand-gray text-brand-muted hover:border-white hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-muted text-xl">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-brand-gray mb-4">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold uppercase tracking-widest border-2 border-white px-4 py-2">Sold Out</span>
                  </div>
                )}
                {/* Quick Add Overlay (Optional, minimalist style usually avoids clutter) */}
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-medium group-hover:text-brand-red transition-colors">{product.name}</h3>
                  <span className="text-brand-muted font-mono">{product.price} ₽</span>
                </div>
                <p className="text-brand-muted text-sm mt-1">{product.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);

  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="text-center py-20 text-white">Product not found. <button onClick={() => navigate('/shop')} className="underline">Go back</button></div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    // Visual feedback handled by navigation or toast normally.
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-brand-gray">
            <img src={product.images[activeImage] || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${activeImage === idx ? 'border-brand-red' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">{product.name}</h1>
          <p className="text-2xl text-brand-red font-mono mb-6">{product.price} RUB</p>
          
          <div className="prose prose-invert text-brand-muted mb-8">
            <p>{product.description}</p>
          </div>

          <div className="space-y-6">
            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Color</label>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      selectedColor === color 
                        ? 'border-brand-red bg-brand-red/10 text-brand-red' 
                        : 'border-brand-gray text-brand-muted hover:border-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Size</label>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-lg border text-sm font-medium text-center ${
                      selectedSize === size
                        ? 'border-brand-red bg-brand-red text-white' 
                        : 'border-brand-gray text-brand-muted hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-6 border-t border-brand-gray">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  product.inStock 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-brand-gray text-brand-muted cursor-not-allowed'
                }`}
              >
                {product.inStock ? (
                  <>Add to Cart <ArrowRight className="h-5 w-5" /></>
                ) : (
                  'Out of Stock'
                )}
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-xs text-brand-muted pt-4">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-red" /> Secure Payment</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-red" /> Worldwide Shipping</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};