import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Catalog, ProductDetails } from './pages/Shop';
import { CartPage, Checkout, OrderSuccess } from './pages/Checkout';
import { AdminDashboard } from './pages/Admin';

const Home = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <img 
          src="https://picsum.photos/id/338/1920/1080" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4">
              TopStore<span className="text-brand-red">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light mb-8 max-w-2xl mx-auto">
              MINIMALISM. QUALITY. AGGRESSION.
            </p>
            <Link 
              to="/shop" 
              className="inline-block bg-brand-red hover:bg-brand-redHover text-white px-8 py-4 text-lg font-bold rounded-none uppercase tracking-widest transition-all hover:scale-105"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold text-white tracking-tight">NEW ARRIVALS</h2>
           <div className="h-1 w-20 bg-brand-red mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "HOODIES", img: "https://picsum.photos/id/447/600/800", link: "/shop" },
             { title: "ACCESSORIES", img: "https://picsum.photos/id/1/600/800", link: "/shop" },
             { title: "PANTS", img: "https://picsum.photos/id/1005/600/800", link: "/shop" }
           ].map((cat, i) => (
             <Link key={i} to={cat.link} className="group relative h-96 overflow-hidden rounded-lg">
                <img src={cat.img} alt={cat.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors">
                  <h3 className="text-3xl font-black text-white tracking-widest border-4 border-white px-6 py-2">{cat.title}</h3>
                </div>
             </Link>
           ))}
        </div>
      </div>
    </div>
  );
};

const About = () => (
  <div className="max-w-4xl mx-auto py-20 px-4 text-center">
    <h1 className="text-4xl font-bold text-white mb-8">WHO WE ARE</h1>
    <p className="text-xl text-brand-muted leading-relaxed mb-6">
      TopStore was born in Minsk with a single vision: to create clothing that speaks louder than words. 
      We blend utilitarian design with modern streetwear aesthetics.
    </p>
    <p className="text-lg text-brand-muted leading-relaxed">
      Our shipping network is optimized for the CIS region, ensuring that no matter where you are in Russia, 
      TopStore reaches you fast.
    </p>
  </div>
);

function App() {
  return (
    <StoreProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </StoreProvider>
  );
}

export default App;