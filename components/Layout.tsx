import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Using HashRouter in App.tsx
import { ShoppingBag, Menu, X, ShieldCheck, Instagram, Facebook } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-brand-black/90 backdrop-blur-md border-b border-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-white">
              TopStore<span className="text-brand-red">.</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path 
                      ? 'text-brand-red' 
                      : 'text-brand-text hover:text-white hover:bg-brand-gray/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/admin" className="text-brand-muted hover:text-white text-xs uppercase tracking-wide">
              Admin
            </Link>
            <Link to="/cart" className="relative p-2 text-brand-text hover:text-brand-red transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-red rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-text hover:text-white hover:bg-brand-gray focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark border-b border-brand-gray">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-brand-gray hover:text-brand-red"
              >
                {link.name}
              </Link>
            ))}
             <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-brand-gray hover:text-brand-red"
              >
                Cart ({cartCount})
              </Link>
               <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-brand-muted hover:text-white"
              >
                Admin Panel
              </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-brand-black border-t border-brand-gray py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold tracking-tighter text-white mb-4">
              TopStore<span className="text-brand-red">.</span>
            </h3>
            <p className="text-brand-muted max-w-sm">
              Premium streetwear designed in Minsk. Quality fabrics, bold cuts, and a relentless spirit. We ship worldwide with a focus on the Russian market.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-brand-muted hover:text-brand-red">Contact Us</Link></li>
              <li><a href="#" className="text-brand-muted hover:text-brand-red">Shipping & Returns</a></li>
              <li><a href="#" className="text-brand-muted hover:text-brand-red">Size Guide</a></li>
              <li><a href="#" className="text-brand-muted hover:text-brand-red">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-brand-muted hover:text-brand-red transition-colors"><Instagram className="h-6 w-6" /></a>
              <a href="#" className="text-brand-muted hover:text-brand-red transition-colors"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="text-brand-muted hover:text-brand-red transition-colors"><ShieldCheck className="h-6 w-6" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-brand-gray pt-8 text-center text-brand-muted text-sm">
          &copy; {new Date().getFullYear()} TopStore Brand. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};